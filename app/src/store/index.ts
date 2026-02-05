import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { 
  User, 
  Product, 
  Cart, 
  CartItem, 
  Order, 
  WellnessEntry, 
  Reminder,
  AIAgent,
  APIConfig,
  SiteSettings,
  Notification,
  PubMedArticle,
  Distributor,
  DistributorApplication,
  DistributorDocument,
  Affiliate,
  AffiliateApplication,
  Commission,
  ForumTopic,
  ForumReply,
  DiseaseEntry,
  APIKey
} from '@/types';

// Auth Store
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      
      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Initialize admin user if not exists (superadmin credentials)
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        const adminExists = users.some((u: User) => u.email === 'froggydoubleoseven@gmail.com');
        
        if (!adminExists) {
          const adminUser: User = {
            id: 'admin-001',
            email: 'froggydoubleoseven@gmail.com',
            password: 'Pierre007007%%%',
            name: 'Super Admin',
            role: 'superadmin',
            membershipStatus: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          users.push(adminUser);
          localStorage.setItem('users', JSON.stringify(users));
        }
        
        // Check credentials
        const user = users.find((u: User) => u.email === email && u.password === password);
        
        if (user) {
          set({ user, isAuthenticated: true, isLoading: false });
          return true;
        }
        
        set({ isLoading: false });
        return false;
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      
      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...userData };
          set({ user: updatedUser });
          
          const users = JSON.parse(localStorage.getItem('users') || '[]');
          const index = users.findIndex((u: User) => u.id === currentUser.id);
          if (index !== -1) {
            users[index] = updatedUser;
            localStorage.setItem('users', JSON.stringify(users));
          }
        }
      },
      
      changePassword: async (_oldPassword: string, _newPassword: string) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return true;
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Cart Store
interface CartState {
  cart: Cart;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;
}

const calculateCartTotals = (items: CartItem[], discount: number = 0): Cart => {
  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const tax = subtotal * 0.13;
  const shipping = subtotal > 100 ? 0 : 15;
  const total = subtotal + tax + shipping - discount;
  
  return {
    items,
    subtotal,
    tax,
    shipping,
    total: Math.max(0, total),
    discount,
  };
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: {
        items: [],
        subtotal: 0,
        tax: 0,
        shipping: 0,
        total: 0,
        discount: 0,
      },
      
      addToCart: (product, quantity) => {
        const { cart } = get();
        const existingItem = cart.items.find(item => item.product.id === product.id);
        
        let newItems: CartItem[];
        if (existingItem) {
          newItems = cart.items.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          newItems = [...cart.items, { product, quantity }];
        }
        
        set({ cart: calculateCartTotals(newItems, cart.discount) });
      },
      
      removeFromCart: (productId) => {
        const { cart } = get();
        const newItems = cart.items.filter(item => item.product.id !== productId);
        set({ cart: calculateCartTotals(newItems, cart.discount) });
      },
      
      updateQuantity: (productId, quantity) => {
        const { cart } = get();
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        
        const newItems = cart.items.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        );
        set({ cart: calculateCartTotals(newItems, cart.discount) });
      },
      
      clearCart: () => {
        set({
          cart: {
            items: [],
            subtotal: 0,
            tax: 0,
            shipping: 0,
            total: 0,
            discount: 0,
          },
        });
      },
      
      applyCoupon: (code) => {
        const { cart } = get();
        const discount = code === 'NANO10' ? cart.subtotal * 0.1 : 0;
        set({ cart: { ...cart, discount, couponCode: code } });
      },
      
      removeCoupon: () => {
        const { cart } = get();
        set({ cart: { ...cart, discount: 0, couponCode: undefined } });
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Product Store
interface ProductState {
  products: Product[];
  featuredProducts: Product[];
  categories: string[];
  isLoading: boolean;
  fetchProducts: () => Promise<void>;
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
  searchProducts: (query: string) => Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

export const useProductStore = create<ProductState>()((set, get) => ({
  products: [],
  featuredProducts: [],
  categories: [],
  isLoading: false,
  
  fetchProducts: async () => {
    set({ isLoading: true });
    
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    
    if (products.length === 0) {
      const sampleProducts = getSampleProducts();
      localStorage.setItem('products', JSON.stringify(sampleProducts));
      set({
        products: sampleProducts,
        featuredProducts: sampleProducts.filter(p => p.isFeatured),
        categories: [...new Set(sampleProducts.map(p => p.category))],
        isLoading: false,
      });
    } else {
      const typedProducts = products as Product[];
      set({
        products: typedProducts,
        featuredProducts: typedProducts.filter(p => p.isFeatured),
        categories: [...new Set(typedProducts.map(p => p.category))],
        isLoading: false,
      });
    }
  },
  
  getProductById: (id) => {
    return get().products.find(p => p.id === id);
  },
  
  getProductsByCategory: (category) => {
    return get().products.filter(p => p.category === category);
  },
  
  searchProducts: (query) => {
    const lowerQuery = query.toLowerCase();
    return get().products.filter(p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  },

  addProduct: (product) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set(state => {
      const products = [...state.products, newProduct];
      localStorage.setItem('products', JSON.stringify(products));
      return {
        products,
        featuredProducts: products.filter(p => p.isFeatured),
        categories: [...new Set(products.map(p => p.category))],
      };
    });
  },

  updateProduct: (id, productData) => {
    set(state => {
      const products = state.products.map(p =>
        p.id === id ? { ...p, ...productData, updatedAt: new Date().toISOString() } : p
      );
      localStorage.setItem('products', JSON.stringify(products));
      return {
        products,
        featuredProducts: products.filter(p => p.isFeatured),
        categories: [...new Set(products.map(p => p.category))],
      };
    });
  },

  deleteProduct: (id) => {
    set(state => {
      const products = state.products.filter(p => p.id !== id);
      localStorage.setItem('products', JSON.stringify(products));
      return {
        products,
        featuredProducts: products.filter(p => p.isFeatured),
        categories: [...new Set(products.map(p => p.category))],
      };
    });
  },
}));

// SilverSol™ Disease Library - Predefined search terms
export const silverSolDiseaseLibrary: DiseaseEntry[] = [
  // Viral Diseases
  { id: '1', name: 'COVID-19 / SARS-CoV-2', category: 'viral', description: 'Novel coronavirus disease', searchTerms: ['SARS-CoV-2', 'COVID-19', 'coronavirus'], isActive: true, articleCount: 0 },
  { id: '2', name: 'HIV / AIDS', category: 'viral', description: 'Human Immunodeficiency Virus', searchTerms: ['HIV', 'AIDS', 'human immunodeficiency virus'], isActive: true, articleCount: 0 },
  { id: '3', name: 'Ebola Virus', category: 'viral', description: 'Ebola hemorrhagic fever', searchTerms: ['Ebola', 'Ebolavirus', 'hemorrhagic fever'], isActive: true, articleCount: 0 },
  { id: '4', name: 'Influenza', category: 'viral', description: 'Seasonal flu virus', searchTerms: ['influenza', 'flu virus', 'H1N1', 'H3N2'], isActive: true, articleCount: 0 },
  { id: '5', name: 'Herpes Simplex', category: 'viral', description: 'HSV-1 and HSV-2', searchTerms: ['herpes simplex', 'HSV', 'herpes virus'], isActive: true, articleCount: 0 },
  { id: '6', name: 'Hepatitis B', category: 'viral', description: 'HBV infection', searchTerms: ['hepatitis B', 'HBV'], isActive: true, articleCount: 0 },
  { id: '7', name: 'Hepatitis C', category: 'viral', description: 'HCV infection', searchTerms: ['hepatitis C', 'HCV'], isActive: true, articleCount: 0 },
  { id: '8', name: 'Dengue Fever', category: 'viral', description: 'Dengue virus infection', searchTerms: ['dengue', 'dengue virus'], isActive: true, articleCount: 0 },
  { id: '9', name: 'Zika Virus', category: 'viral', description: 'Zika fever', searchTerms: ['Zika', 'Zika virus'], isActive: true, articleCount: 0 },
  { id: '10', name: 'West Nile Virus', category: 'viral', description: 'WNV infection', searchTerms: ['West Nile virus', 'WNV'], isActive: true, articleCount: 0 },
  
  // Bacterial Infections
  { id: '11', name: 'Staphylococcus aureus', category: 'bacterial', description: 'MRSA and MSSA infections', searchTerms: ['Staphylococcus aureus', 'MRSA', 'Staph'], isActive: true, articleCount: 0 },
  { id: '12', name: 'E. coli', category: 'bacterial', description: 'Escherichia coli infections', searchTerms: ['E. coli', 'Escherichia coli'], isActive: true, articleCount: 0 },
  { id: '13', name: 'Pseudomonas aeruginosa', category: 'bacterial', description: 'Pseudomonas infections', searchTerms: ['Pseudomonas', 'Pseudomonas aeruginosa'], isActive: true, articleCount: 0 },
  { id: '14', name: 'Salmonella', category: 'bacterial', description: 'Salmonellosis', searchTerms: ['Salmonella', 'salmonellosis'], isActive: true, articleCount: 0 },
  { id: '15', name: 'Streptococcus', category: 'bacterial', description: 'Strep infections', searchTerms: ['Streptococcus', 'strep'], isActive: true, articleCount: 0 },
  { id: '16', name: 'Klebsiella pneumoniae', category: 'bacterial', description: 'Klebsiella infections', searchTerms: ['Klebsiella', 'Klebsiella pneumoniae'], isActive: true, articleCount: 0 },
  { id: '17', name: 'Acinetobacter baumannii', category: 'bacterial', description: 'Acinetobacter infections', searchTerms: ['Acinetobacter', 'Acinetobacter baumannii'], isActive: true, articleCount: 0 },
  { id: '18', name: 'Tuberculosis', category: 'bacterial', description: 'Mycobacterium tuberculosis', searchTerms: ['tuberculosis', 'TB', 'Mycobacterium tuberculosis'], isActive: true, articleCount: 0 },
  { id: '19', name: 'Lyme Disease', category: 'bacterial', description: 'Borrelia burgdorferi', searchTerms: ['Lyme disease', 'Borrelia'], isActive: true, articleCount: 0 },
  { id: '20', name: 'Chlamydia', category: 'bacterial', description: 'Chlamydia trachomatis', searchTerms: ['Chlamydia', 'Chlamydia trachomatis'], isActive: true, articleCount: 0 },
  
  // Parasitic Infections
  { id: '21', name: 'Malaria', category: 'parasitic', description: 'Plasmodium infection', searchTerms: ['malaria', 'Plasmodium'], isActive: true, articleCount: 0 },
  { id: '22', name: 'Giardia', category: 'parasitic', description: 'Giardiasis', searchTerms: ['Giardia', 'giardiasis'], isActive: true, articleCount: 0 },
  { id: '23', name: 'Cryptosporidium', category: 'parasitic', description: 'Cryptosporidiosis', searchTerms: ['Cryptosporidium', 'cryptosporidiosis'], isActive: true, articleCount: 0 },
  { id: '24', name: 'Toxoplasma', category: 'parasitic', description: 'Toxoplasmosis', searchTerms: ['Toxoplasma', 'toxoplasmosis'], isActive: true, articleCount: 0 },
  { id: '25', name: 'Leishmania', category: 'parasitic', description: 'Leishmaniasis', searchTerms: ['Leishmania', 'leishmaniasis'], isActive: true, articleCount: 0 },
  { id: '26', name: 'Trypanosoma', category: 'parasitic', description: 'Trypanosomiasis', searchTerms: ['Trypanosoma', 'trypanosomiasis', 'sleeping sickness'], isActive: true, articleCount: 0 },
  { id: '27', name: 'Entamoeba histolytica', category: 'parasitic', description: 'Amoebiasis', searchTerms: ['Entamoeba', 'amoebiasis'], isActive: true, articleCount: 0 },
  { id: '28', name: 'Trichomonas', category: 'parasitic', description: 'Trichomoniasis', searchTerms: ['Trichomonas', 'trichomoniasis'], isActive: true, articleCount: 0 },
  
  // Fungal Infections
  { id: '29', name: 'Candida albicans', category: 'fungal', description: 'Candidiasis', searchTerms: ['Candida', 'candidiasis', 'yeast infection'], isActive: true, articleCount: 0 },
  { id: '30', name: 'Aspergillus', category: 'fungal', description: 'Aspergillosis', searchTerms: ['Aspergillus', 'aspergillosis'], isActive: true, articleCount: 0 },
  { id: '31', name: 'Dermatophytes', category: 'fungal', description: 'Ringworm, athlete\'s foot', searchTerms: ['dermatophyte', 'ringworm', 'athlete foot', 'tinea'], isActive: true, articleCount: 0 },
  
  // Other Conditions
  { id: '32', name: 'Wound Healing', category: 'other', description: 'Chronic wounds, burns', searchTerms: ['wound healing', 'chronic wound', 'burn treatment'], isActive: true, articleCount: 0 },
  { id: '33', name: 'Dental Infections', category: 'other', description: 'Oral pathogens', searchTerms: ['dental infection', 'oral bacteria', 'periodontal'], isActive: true, articleCount: 0 },
  { id: '34', name: 'Eye Infections', category: 'other', description: 'Ocular pathogens', searchTerms: ['eye infection', 'conjunctivitis', 'ocular'], isActive: true, articleCount: 0 },
  { id: '35', name: 'Skin Infections', category: 'other', description: 'Dermatological conditions', searchTerms: ['skin infection', 'dermatitis', 'eczema'], isActive: true, articleCount: 0 },
  { id: '36', name: 'Respiratory Infections', category: 'other', description: 'Lung and airway infections', searchTerms: ['respiratory infection', 'pneumonia', 'bronchitis'], isActive: true, articleCount: 0 },
  { id: '37', name: 'Urinary Tract Infections', category: 'other', description: 'UTI pathogens', searchTerms: ['UTI', 'urinary tract infection', 'cystitis'], isActive: true, articleCount: 0 },
  { id: '38', name: 'Biofilm', category: 'other', description: 'Microbial biofilms', searchTerms: ['biofilm', 'bacterial biofilm', 'microbial biofilm'], isActive: true, articleCount: 0 },
  { id: '39', name: 'Antibiotic Resistance', category: 'other', description: 'Drug-resistant pathogens', searchTerms: ['antibiotic resistance', 'drug resistance', 'multidrug resistant'], isActive: true, articleCount: 0 },
  { id: '40', name: 'HPV', category: 'viral', description: 'Human Papillomavirus', searchTerms: ['HPV', 'human papillomavirus'], isActive: true, articleCount: 0 },
];

// Research Store
interface ResearchState {
  articles: PubMedArticle[];
  isLoading: boolean;
  totalCount: number;
  currentPage: number;
  searchQuery: string;
  diseaseLibrary: DiseaseEntry[];
  searchArticles: (query: string, page?: number) => Promise<void>;
  searchByDisease: (diseaseId: string) => Promise<void>;
  clearSearch: () => void;
  addDiseaseEntry: (entry: Omit<DiseaseEntry, 'id'>) => void;
  updateDiseaseEntry: (id: string, entry: Partial<DiseaseEntry>) => void;
  deleteDiseaseEntry: (id: string) => void;
}

export const useResearchStore = create<ResearchState>()((set, get) => ({
  articles: [],
  isLoading: false,
  totalCount: 0,
  currentPage: 1,
  searchQuery: '',
  diseaseLibrary: JSON.parse(localStorage.getItem('diseaseLibrary') || 'null') || silverSolDiseaseLibrary,
  
  searchArticles: async (query, page = 1) => {
    set({ isLoading: true, searchQuery: query, currentPage: page });
    
    try {
      const searchTerm = `(silver nanoparticles OR colloidal silver) AND (${query})`;
      
      const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(searchTerm)}&retmode=json&retmax=20&retstart=${(page - 1) * 20}`;
      
      const searchResponse = await fetch(searchUrl);
      const searchData = await searchResponse.json();
      
      const ids = searchData.esearchresult.idlist;
      const totalCount = parseInt(searchData.esearchresult.count);
      
      if (ids.length === 0) {
        set({ articles: [], isLoading: false, totalCount: 0 });
        return;
      }
      
      const summaryUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${ids.join(',')}&retmode=json`;
      
      const summaryResponse = await fetch(summaryUrl);
      const summaryData = await summaryResponse.json();
      
      const articles: PubMedArticle[] = ids.map((id: string) => {
        const article = summaryData.result[id];
        return {
          pmid: id,
          title: article?.title || 'No title available',
          abstract: article?.abstract || 'Abstract not available',
          authors: article?.authors?.map((a: any) => a.name) || [],
          journal: article?.fulljournalname || article?.source || 'Unknown Journal',
          publicationDate: article?.pubdate || 'Unknown',
          year: parseInt(article?.pubdate?.split(' ')[0]) || new Date().getFullYear(),
          doi: article?.elocationid,
          url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
          keywords: Array.isArray(article?.keywords) ? article.keywords as string[] : [],
        };
      });
      
      set({ articles, totalCount, isLoading: false });
    } catch (error) {
      console.error('PubMed search error:', error);
      set({ articles: [], isLoading: false });
    }
  },

  searchByDisease: async (diseaseId: string) => {
    const disease = get().diseaseLibrary.find(d => d.id === diseaseId);
    if (!disease) return;
    
    const searchTerms = disease.searchTerms.join(' OR ');
    await get().searchArticles(searchTerms);
  },
  
  clearSearch: () => {
    set({ articles: [], searchQuery: '', totalCount: 0, currentPage: 1 });
  },

  addDiseaseEntry: (entry) => {
    const newEntry: DiseaseEntry = {
      ...entry,
      id: Date.now().toString(),
    };
    set(state => {
      const library = [...state.diseaseLibrary, newEntry];
      localStorage.setItem('diseaseLibrary', JSON.stringify(library));
      return { diseaseLibrary: library };
    });
  },

  updateDiseaseEntry: (id, entryData) => {
    set(state => {
      const library = state.diseaseLibrary.map(e =>
        e.id === id ? { ...e, ...entryData } : e
      );
      localStorage.setItem('diseaseLibrary', JSON.stringify(library));
      return { diseaseLibrary: library };
    });
  },

  deleteDiseaseEntry: (id) => {
    set(state => {
      const library = state.diseaseLibrary.filter(e => e.id !== id);
      localStorage.setItem('diseaseLibrary', JSON.stringify(library));
      return { diseaseLibrary: library };
    });
  },
}));

// Wellness Journal Store
interface WellnessState {
  entries: WellnessEntry[];
  reminders: Reminder[];
  addEntry: (entry: Omit<WellnessEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEntry: (id: string, entry: Partial<WellnessEntry>) => void;
  deleteEntry: (id: string) => void;
  addReminder: (reminder: Omit<Reminder, 'id' | 'createdAt'>) => void;
  updateReminder: (id: string, reminder: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  exportData: () => string;
}

export const useWellnessStore = create<WellnessState>()(
  persist(
    (set, get) => ({
      entries: [],
      reminders: [],
      
      addEntry: (entry) => {
        const newEntry: WellnessEntry = {
          ...entry,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set(state => ({ entries: [newEntry, ...state.entries] }));
      },
      
      updateEntry: (id, entryData) => {
        set(state => ({
          entries: state.entries.map(entry =>
            entry.id === id
              ? { ...entry, ...entryData, updatedAt: new Date().toISOString() }
              : entry
          ),
        }));
      },
      
      deleteEntry: (id) => {
        set(state => ({
          entries: state.entries.filter(entry => entry.id !== id),
        }));
      },
      
      addReminder: (reminder) => {
        const newReminder: Reminder = {
          ...reminder,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };
        set(state => ({ reminders: [...state.reminders, newReminder] }));
      },
      
      updateReminder: (id, reminderData) => {
        set(state => ({
          reminders: state.reminders.map(reminder =>
            reminder.id === id ? { ...reminder, ...reminderData } : reminder
          ),
        }));
      },
      
      deleteReminder: (id) => {
        set(state => ({
          reminders: state.reminders.filter(reminder => reminder.id !== id),
        }));
      },
      
      exportData: () => {
        const { entries } = get();
        return JSON.stringify(entries, null, 2);
      },
    }),
    {
      name: 'wellness-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Distributor Store
interface DistributorState {
  distributors: Distributor[];
  applications: DistributorApplication[];
  documents: DistributorDocument[];
  fetchDistributors: () => Promise<void>;
  addDistributor: (distributor: Omit<Distributor, 'id' | 'joinedAt'>) => void;
  updateDistributor: (id: string, data: Partial<Distributor>) => void;
  deleteDistributor: (id: string) => void;
  submitApplication: (application: Omit<DistributorApplication, 'id' | 'submittedAt' | 'status'>) => void;
  approveApplication: (id: string) => void;
  rejectApplication: (id: string, reason: string) => void;
  addDocument: (document: Omit<DistributorDocument, 'id' | 'uploadedAt' | 'downloadCount'>) => void;
  deleteDocument: (id: string) => void;
}

export const useDistributorStore = create<DistributorState>()(
  persist(
    (set) => ({
      distributors: [],
      applications: [],
      documents: [],

      fetchDistributors: async () => {
        const distributors = JSON.parse(localStorage.getItem('distributors') || '[]');
        const applications = JSON.parse(localStorage.getItem('distributorApplications') || '[]');
        const documents = JSON.parse(localStorage.getItem('distributorDocuments') || '[]');
        set({ distributors, applications, documents });
      },

      addDistributor: (distributor: Omit<Distributor, 'id' | 'joinedAt'>) => {
        const newDistributor: Distributor = {
          ...distributor,
          id: Date.now().toString(),
          joinedAt: new Date().toISOString(),
        };
        set(state => {
          const distributors = [...state.distributors, newDistributor];
          localStorage.setItem('distributors', JSON.stringify(distributors));
          return { distributors };
        });
      },

      updateDistributor: (distId: string, data) => {
        set(state => {
          const distributors = state.distributors.map(d =>
            d.id === distId ? { ...d, ...data } : d
          );
          localStorage.setItem('distributors', JSON.stringify(distributors));
          return { distributors };
        });
      },

      deleteDistributor: (distId: string) => {
        set(state => {
          const distributors = state.distributors.filter(d => d.id !== distId);
          localStorage.setItem('distributors', JSON.stringify(distributors));
          return { distributors };
        });
      },

      submitApplication: (application: Omit<DistributorApplication, 'id' | 'submittedAt' | 'status'>) => {
        const newApplication: DistributorApplication = {
          ...application,
          id: Date.now().toString(),
          submittedAt: new Date().toISOString(),
          status: 'pending',
        };
        set(state => {
          const applications = [...state.applications, newApplication];
          localStorage.setItem('distributorApplications', JSON.stringify(applications));
          return { applications };
        });
      },
      approveApplication: (appId: string) => {
        set(state => {
          const applications = state.applications.map(app =>
            app.id === appId ? { ...app, status: 'approved' as const, reviewedAt: new Date().toISOString() } : app
          );
          localStorage.setItem('distributorApplications', JSON.stringify(applications));
          return { applications };
        });
      },

      rejectApplication: (appId: string, reason: string) => {
        set(state => {
          const applications = state.applications.map(app =>
            app.id === appId ? { ...app, status: 'rejected' as const, reviewedAt: new Date().toISOString(), rejectionReason: reason } : app
          );
          localStorage.setItem('distributorApplications', JSON.stringify(applications));
          return { applications };
        });
      },

      addDocument: (document: Omit<DistributorDocument, 'id' | 'uploadedAt' | 'downloadCount'>) => {
        const newDocument: DistributorDocument = {
          ...document,
          id: Date.now().toString(),
          uploadedAt: new Date().toISOString(),
          downloadCount: 0,
        };
        set(state => {
          const documents = [...state.documents, newDocument];
          localStorage.setItem('distributorDocuments', JSON.stringify(documents));
          return { documents };
        });
      },

      deleteDocument: (id: string) => {
        set(state => {
          const documents = state.documents.filter(d => d.id !== id);
          localStorage.setItem('distributorDocuments', JSON.stringify(documents));
          return { documents };
        });
      },
    }),
    {
      name: 'distributor-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Affiliate Store
interface AffiliateState {
  affiliates: Affiliate[];
  applications: AffiliateApplication[];
  commissions: Commission[];
  fetchAffiliates: () => Promise<void>;
  addAffiliate: (affiliate: Omit<Affiliate, 'id' | 'joinedAt' | 'referralCode' | 'referralUrl'>) => void;
  updateAffiliate: (id: string, data: Partial<Affiliate>) => void;
  deleteAffiliate: (id: string) => void;
  submitApplication: (application: Omit<AffiliateApplication, 'id' | 'submittedAt' | 'status'>) => void;
  approveApplication: (id: string) => void;
  rejectApplication: (id: string, reason: string) => void;
  addCommission: (commission: Omit<Commission, 'id' | 'createdAt'>) => void;
  approveCommission: (id: string) => void;
  payCommission: (id: string) => void;
}

export const useAffiliateStore = create<AffiliateState>()(
  persist(
    (set) => ({
      affiliates: [],
      applications: [],
      commissions: [],

      fetchAffiliates: async () => {
        const affiliates = JSON.parse(localStorage.getItem('affiliates') || '[]');
        const applications = JSON.parse(localStorage.getItem('affiliateApplications') || '[]');
        const commissions = JSON.parse(localStorage.getItem('commissions') || '[]');
        set({ affiliates, applications, commissions });
      },

      addAffiliate: (affiliate: Omit<Affiliate, 'id' | 'joinedAt' | 'referralCode' | 'referralUrl'>) => {
        const referralCode = Math.random().toString(36).substring(2, 10).toUpperCase();
        const newAffiliate: Affiliate = {
          ...affiliate,
          id: Date.now().toString(),
          joinedAt: new Date().toISOString(),
          referralCode,
          referralUrl: `https://canadananosilver.com/ref/${referralCode}`,
        };
        set(state => {
          const affiliates = [...state.affiliates, newAffiliate];
          localStorage.setItem('affiliates', JSON.stringify(affiliates));
          return { affiliates };
        });
      },

      updateAffiliate: (affId: string, data) => {
        set(state => {
          const affiliates = state.affiliates.map(a =>
            a.id === affId ? { ...a, ...data } : a
          );
          localStorage.setItem('affiliates', JSON.stringify(affiliates));
          return { affiliates };
        });
      },

      deleteAffiliate: (affId: string) => {
        set(state => {
          const affiliates = state.affiliates.filter(a => a.id !== affId);
          localStorage.setItem('affiliates', JSON.stringify(affiliates));
          return { affiliates };
        });
      },

      submitApplication: (application: Omit<AffiliateApplication, 'id' | 'submittedAt' | 'status'>) => {
        const newApplication: AffiliateApplication = {
          ...application,
          id: Date.now().toString(),
          submittedAt: new Date().toISOString(),
          status: 'pending',
        };
        set(state => {
          const applications = [...state.applications, newApplication];
          localStorage.setItem('affiliateApplications', JSON.stringify(applications));
          return { applications };
        });
      },

      approveApplication: (appId: string) => {
        set(state => {
          const applications = state.applications.map(app =>
            app.id === appId ? { ...app, status: 'approved' as const, reviewedAt: new Date().toISOString() } : app
          );
          localStorage.setItem('affiliateApplications', JSON.stringify(applications));
          return { applications };
        });
      },

      rejectApplication: (appId: string, reason: string) => {
        set(state => {
          const applications = state.applications.map(app =>
            app.id === appId ? { ...app, status: 'rejected' as const, reviewedAt: new Date().toISOString(), rejectionReason: reason } : app
          );
          localStorage.setItem('affiliateApplications', JSON.stringify(applications));
          return { applications };
        });
      },

      addCommission: (commission: Omit<Commission, 'id' | 'createdAt'>) => {
        const newCommission: Commission = {
          ...commission,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };
        set(state => {
          const commissions = [...state.commissions, newCommission];
          localStorage.setItem('commissions', JSON.stringify(commissions));
          return { commissions };
        });
      },

      approveCommission: (commId: string) => {
        set(state => {
          const commissions = state.commissions.map(c =>
            c.id === commId ? { ...c, status: 'approved' as const, approvedAt: new Date().toISOString() } : c
          );
          localStorage.setItem('commissions', JSON.stringify(commissions));
          return { commissions };
        });
      },

      payCommission: (commId: string) => {
        set(state => {
          const commissions = state.commissions.map(c =>
            c.id === commId ? { ...c, status: 'paid' as const, paidAt: new Date().toISOString() } : c
          );
          localStorage.setItem('commissions', JSON.stringify(commissions));
          return { commissions };
        });
      },
    }),
    {
      name: 'affiliate-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Forum Store
interface ForumState {
  topics: ForumTopic[];
  fetchTopics: () => Promise<void>;
  addTopic: (topic: Omit<ForumTopic, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'replies'>) => void;
  addReply: (topicId: string, reply: Omit<ForumReply, 'id' | 'createdAt' | 'updatedAt' | 'likes'>) => void;
  deleteTopic: (id: string) => void;
  deleteReply: (topicId: string, replyId: string) => void;
}

export const useForumStore = create<ForumState>()(
  persist(
    (set) => ({
      topics: [],

      fetchTopics: async () => {
        const topics = JSON.parse(localStorage.getItem('forumTopics') || '[]');
        set({ topics });
      },

      addTopic: (topic: Omit<ForumTopic, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'replies'>) => {
        const newTopic: ForumTopic = {
          ...topic,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          views: 0,
          replies: [],
        };
        set(state => {
          const topics = [newTopic, ...state.topics];
          localStorage.setItem('forumTopics', JSON.stringify(topics));
          return { topics };
        });
      },

      addReply: (topicId: string, reply: Omit<ForumReply, 'id' | 'createdAt' | 'updatedAt' | 'likes'>) => {
        const newReply: ForumReply = {
          ...reply,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          likes: 0,
        };
        set(state => {
          const topics = state.topics.map(t =>
            t.id === topicId
              ? { ...t, replies: [...t.replies, newReply], updatedAt: new Date().toISOString() }
              : t
          );
          localStorage.setItem('forumTopics', JSON.stringify(topics));
          return { topics };
        });
      },

      deleteTopic: (id: string) => {
        set(state => {
          const topics = state.topics.filter(t => t.id !== id);
          localStorage.setItem('forumTopics', JSON.stringify(topics));
          return { topics };
        });
      },

      deleteReply: (topicId: string, replyId: string) => {
        set(state => {
          const topics = state.topics.map(t =>
            t.id === topicId
              ? { ...t, replies: t.replies.filter(r => r.id !== replyId) }
              : t
          );
          localStorage.setItem('forumTopics', JSON.stringify(topics));
          return { topics };
        });
      },
    }),
    {
      name: 'forum-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// API Keys Store
interface APIKeysState {
  apiKeys: APIKey[];
  fetchAPIKeys: () => Promise<void>;
  addAPIKey: (key: Omit<APIKey, 'id' | 'createdAt' | 'usageCount'>) => void;
  updateAPIKey: (id: string, data: Partial<APIKey>) => void;
  deleteAPIKey: (id: string) => void;
  incrementUsage: (id: string) => void;
}

export const useAPIKeysStore = create<APIKeysState>()(
  persist(
    (set) => ({
      apiKeys: [],

      fetchAPIKeys: async () => {
        const apiKeys = JSON.parse(localStorage.getItem('apiKeys') || '[]');
        set({ apiKeys });
      },

      addAPIKey: (key: Omit<APIKey, 'id' | 'createdAt' | 'usageCount'>) => {
        const newKey: APIKey = {
          ...key,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          usageCount: 0,
        };
        set(state => {
          const apiKeys = [...state.apiKeys, newKey];
          localStorage.setItem('apiKeys', JSON.stringify(apiKeys));
          return { apiKeys };
        });
      },

      updateAPIKey: (id, data) => {
        set(state => {
          const apiKeys = state.apiKeys.map(k =>
            k.id === id ? { ...k, ...data } : k
          );
          localStorage.setItem('apiKeys', JSON.stringify(apiKeys));
          return { apiKeys };
        });
      },

      deleteAPIKey: (id: string) => {
        set(state => {
          const apiKeys = state.apiKeys.filter(k => k.id !== id);
          localStorage.setItem('apiKeys', JSON.stringify(apiKeys));
          return { apiKeys };
        });
      },

      incrementUsage: (id: string) => {
        set(state => {
          const apiKeys = state.apiKeys.map(k =>
            k.id === id ? { ...k, usageCount: k.usageCount + 1, lastUsedAt: new Date().toISOString() } : k
          );
          localStorage.setItem('apiKeys', JSON.stringify(apiKeys));
          return { apiKeys };
        });
      },
    }),
    {
      name: 'apikeys-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Admin Store
interface AdminState {
  users: User[];
  orders: Order[];
  agents: AIAgent[];
  apiConfigs: APIConfig[];
  settings: SiteSettings;
  notifications: Notification[];
  isLoading: boolean;
  
  fetchUsers: () => Promise<void>;
  updateUserRole: (userId: string, role: User['role']) => void;
  updateUserMembership: (userId: string, status: User['membershipStatus']) => void;
  deleteUser: (userId: string) => void;
  
  fetchOrders: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  
  addAgent: (agent: Omit<AIAgent, 'id'>) => void;
  updateAgent: (id: string, agent: Partial<AIAgent>) => void;
  deleteAgent: (id: string) => void;
  
  addAPIConfig: (config: Omit<APIConfig, 'id'>) => void;
  updateAPIConfig: (id: string, config: Partial<APIConfig>) => void;
  deleteAPIConfig: (id: string) => void;
  
  updateSettings: (settings: Partial<SiteSettings>) => void;
  
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
}

const defaultSettings: SiteSettings = {
  siteName: 'Canada Nano Silver - Premium Wellness Products',
  siteDescription: 'Premium wellness products featuring 3-5nm silver nanoparticles',
  contactEmail: 'info@canadananosilver.com',
  supportPhone: '+1-800-NANO-SILVER',
  address: 'Canada',
  socialLinks: {},
  maintenanceMode: false,
  allowRegistration: true,
  defaultCurrency: 'CAD',
  taxRate: 13,
  shippingRates: [
    { name: 'Standard', minWeight: 0, maxWeight: 1000, price: 15, region: 'Canada' },
    { name: 'Express', minWeight: 0, maxWeight: 1000, price: 25, region: 'Canada' },
  ],
};

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      users: [],
      orders: [],
      agents: [],
      apiConfigs: [],
      settings: defaultSettings,
      notifications: [],
      isLoading: false,
      
      fetchUsers: async () => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        set({ users });
      },
      
      updateUserRole: (userId, role) => {
        set(state => ({
          users: state.users.map(user =>
            user.id === userId ? { ...user, role } : user
          ),
        }));
        localStorage.setItem('users', JSON.stringify(get().users));
      },
      
      updateUserMembership: (userId, status) => {
        set(state => ({
          users: state.users.map(user =>
            user.id === userId ? { ...user, membershipStatus: status } : user
          ),
        }));
        localStorage.setItem('users', JSON.stringify(get().users));
      },
      
      deleteUser: (userId) => {
        set(state => ({
          users: state.users.filter(user => user.id !== userId),
        }));
        localStorage.setItem('users', JSON.stringify(get().users));
      },
      
      fetchOrders: async () => {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        set({ orders });
      },
      
      updateOrderStatus: (orderId, status) => {
        set(state => ({
          orders: state.orders.map(order =>
            order.id === orderId ? { ...order, status, updatedAt: new Date().toISOString() } : order
          ),
        }));
        localStorage.setItem('orders', JSON.stringify(get().orders));
      },
      
      addAgent: (agent) => {
        const newAgent: AIAgent = {
          ...agent,
          id: Date.now().toString(),
        };
        set(state => ({ agents: [...state.agents, newAgent] }));
        localStorage.setItem('agents', JSON.stringify(get().agents));
      },
      
      updateAgent: (id, agentData) => {
        set(state => ({
          agents: state.agents.map(agent =>
            agent.id === id ? { ...agent, ...agentData } : agent
          ),
        }));
        localStorage.setItem('agents', JSON.stringify(get().agents));
      },
      
      deleteAgent: (id) => {
        set(state => ({
          agents: state.agents.filter(agent => agent.id !== id),
        }));
        localStorage.setItem('agents', JSON.stringify(get().agents));
      },
      
      addAPIConfig: (config) => {
        const newConfig: APIConfig = {
          ...config,
          id: Date.now().toString(),
        };
        set(state => ({ apiConfigs: [...state.apiConfigs, newConfig] }));
        localStorage.setItem('apiConfigs', JSON.stringify(get().apiConfigs));
      },
      
      updateAPIConfig: (id, configData) => {
        set(state => ({
          apiConfigs: state.apiConfigs.map(config =>
            config.id === id ? { ...config, ...configData } : config
          ),
        }));
        localStorage.setItem('apiConfigs', JSON.stringify(get().apiConfigs));
      },
      
      deleteAPIConfig: (id) => {
        set(state => ({
          apiConfigs: state.apiConfigs.filter(config => config.id !== id),
        }));
        localStorage.setItem('apiConfigs', JSON.stringify(get().apiConfigs));
      },
      
      updateSettings: (settingsData) => {
        set(state => ({
          settings: { ...state.settings, ...settingsData },
        }));
      },
      
      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };
        set(state => ({ notifications: [newNotification, ...state.notifications] }));
      },
      
      markNotificationRead: (id) => {
        set(state => ({
          notifications: state.notifications.map(n =>
            n.id === id ? { ...n, isRead: true } : n
          ),
        }));
      },
      
      clearNotifications: () => {
        set({ notifications: [] });
      },
    }),
    {
      name: 'admin-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Sample Products Data
function getSampleProducts(): Product[] {
  return [
    {
      id: '1',
      name: 'Nano Silver Solution 10ppm',
      description: 'Our premium nano silver solution features ultra-small silver nanoparticles (3-5nm) suspended in purified water. Manufactured by American Biotech Labs using proprietary SilverSol™ Technology.',
      shortDescription: 'Premium 10ppm colloidal silver solution with 3-5nm particles',
      price: 49.99,
      comparePrice: 59.99,
      sku: 'NS-10PPM-500ML',
      category: 'Colloidal Silver',
      images: ['/products/nano-silver-10ppm.jpg'],
      stock: 100,
      minOrderQuantity: 1,
      maxOrderQuantity: 10,
      weight: 500,
      dimensions: { length: 8, width: 8, height: 20, unit: 'cm' },
      specifications: [
        { label: 'Concentration', value: '10 ppm (parts per million)' },
        { label: 'Particle Size', value: '3-5 nanometers' },
        { label: 'Volume', value: '500ml' },
        { label: 'Packaging', value: 'Amber glass bottle with dropper' },
        { label: 'Shelf Life', value: '2 years when stored properly' },
        { label: 'Manufactured', value: 'Canada' },
      ],
      certifications: ['GMP Certified', 'Third Party Tested', 'ISO 9001'],
      tags: ['nano silver', 'colloidal silver', 'immune support', 'wellness'],
      isActive: true,
      isFeatured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rating: 4.8,
      reviewCount: 127,
    },
    {
      id: '2',
      name: 'Nano Silver Solution 20ppm',
      description: 'Higher concentration nano silver solution for those seeking enhanced potency. Same ultra-small 3-5nm particle size with double the concentration.',
      shortDescription: 'Enhanced 20ppm colloidal silver solution with 3-5nm particles',
      price: 79.99,
      comparePrice: 89.99,
      sku: 'NS-20PPM-500ML',
      category: 'Colloidal Silver',
      images: ['/products/nano-silver-20ppm.jpg'],
      stock: 75,
      minOrderQuantity: 1,
      maxOrderQuantity: 5,
      weight: 500,
      dimensions: { length: 8, width: 8, height: 20, unit: 'cm' },
      specifications: [
        { label: 'Concentration', value: '20 ppm (parts per million)' },
        { label: 'Particle Size', value: '3-5 nanometers' },
        { label: 'Volume', value: '500ml' },
        { label: 'Packaging', value: 'Amber glass bottle with dropper' },
        { label: 'Shelf Life', value: '2 years when stored properly' },
        { label: 'Manufactured', value: 'Canada' },
      ],
      certifications: ['GMP Certified', 'Third Party Tested', 'ISO 9001'],
      tags: ['nano silver', 'colloidal silver', 'high potency', 'wellness'],
      isActive: true,
      isFeatured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rating: 4.9,
      reviewCount: 89,
    },
    {
      id: '3',
      name: 'Nano Silver Gel',
      description: 'Topical nano silver gel for external application. Combines the benefits of nano silver with aloe vera and vitamin E for skin support.',
      shortDescription: 'Topical nano silver gel with aloe vera and vitamin E',
      price: 34.99,
      comparePrice: 39.99,
      sku: 'NS-GEL-100ML',
      category: 'Topical',
      images: ['/products/nano-silver-gel.jpg'],
      stock: 150,
      minOrderQuantity: 1,
      maxOrderQuantity: 10,
      weight: 120,
      dimensions: { length: 5, width: 5, height: 12, unit: 'cm' },
      specifications: [
        { label: 'Concentration', value: '25 ppm nano silver' },
        { label: 'Volume', value: '100ml' },
        { label: 'Base', value: 'Aloe vera gel' },
        { label: 'Additional Ingredients', value: 'Vitamin E, Tea Tree Oil' },
        { label: 'Application', value: 'External use only' },
        { label: 'Manufactured', value: 'Canada' },
      ],
      certifications: ['GMP Certified', 'Dermatologically Tested'],
      tags: ['nano silver', 'topical', 'skin care', 'gel'],
      isActive: true,
      isFeatured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rating: 4.7,
      reviewCount: 203,
    },
    {
      id: '4',
      name: 'Nano Silver Nasal Spray',
      description: 'Gentle nasal spray containing nano silver solution. Designed for easy application with a fine mist sprayer.',
      shortDescription: 'Gentle nano silver nasal spray with fine mist application',
      price: 29.99,
      sku: 'NS-NASAL-30ML',
      category: 'Nasal Sprays',
      images: ['/products/nano-silver-nasal.jpg'],
      stock: 80,
      minOrderQuantity: 1,
      maxOrderQuantity: 5,
      weight: 50,
      dimensions: { length: 3, width: 3, height: 10, unit: 'cm' },
      specifications: [
        { label: 'Concentration', value: '10 ppm nano silver' },
        { label: 'Volume', value: '30ml' },
        { label: 'Spray Type', value: 'Fine mist' },
        { label: 'Preservative', value: 'None' },
        { label: 'Application', value: 'Nasal use' },
        { label: 'Manufactured', value: 'Canada' },
      ],
      certifications: ['GMP Certified', 'Health Canada Compliant'],
      tags: ['nano silver', 'nasal spray', 'respiratory', 'wellness'],
      isActive: true,
      isFeatured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rating: 4.6,
      reviewCount: 156,
    },
    {
      id: '5',
      name: 'Nano Silver Throat Spray',
      description: 'Soothing throat spray with nano silver and natural mint flavor. Convenient pocket-sized spray bottle.',
      shortDescription: 'Soothing nano silver throat spray with natural mint',
      price: 24.99,
      sku: 'NS-THROAT-30ML',
      category: 'Throat Sprays',
      images: ['/products/nano-silver-throat.jpg'],
      stock: 120,
      minOrderQuantity: 1,
      maxOrderQuantity: 5,
      weight: 45,
      dimensions: { length: 3, width: 3, height: 10, unit: 'cm' },
      specifications: [
        { label: 'Concentration', value: '15 ppm nano silver' },
        { label: 'Volume', value: '30ml' },
        { label: 'Flavor', value: 'Natural mint' },
        { label: 'Additional', value: 'Honey extract' },
        { label: 'Application', value: 'Oral/throat use' },
        { label: 'Manufactured', value: 'Canada' },
      ],
      certifications: ['GMP Certified', 'Health Canada Compliant'],
      tags: ['nano silver', 'throat spray', 'oral care', 'wellness'],
      isActive: true,
      isFeatured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rating: 4.5,
      reviewCount: 178,
    },
    {
      id: '6',
      name: 'Nano Silver Soap',
      description: 'Artisan-crafted soap infused with nano silver. Made with natural ingredients including coconut oil, olive oil, and shea butter.',
      shortDescription: 'Artisan nano silver soap with natural ingredients',
      price: 14.99,
      sku: 'NS-SOAP-100G',
      category: 'Personal Care',
      images: ['/products/nano-silver-soap.jpg'],
      stock: 200,
      minOrderQuantity: 1,
      maxOrderQuantity: 20,
      weight: 100,
      dimensions: { length: 8, width: 5, height: 3, unit: 'cm' },
      specifications: [
        { label: 'Nano Silver', value: '10 ppm infused' },
        { label: 'Weight', value: '100g' },
        { label: 'Base Oils', value: 'Coconut, Olive, Shea Butter' },
        { label: 'Scent', value: 'Tea Tree & Eucalyptus' },
        { label: 'Type', value: 'Hand & body soap' },
        { label: 'Manufactured', value: 'Canada' },
      ],
      certifications: ['Natural Ingredients', 'Cruelty Free'],
      tags: ['nano silver', 'soap', 'personal care', 'natural'],
      isActive: true,
      isFeatured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rating: 4.8,
      reviewCount: 312,
    },
    {
      id: '7',
      name: 'Nano Silver Travel Kit',
      description: 'Complete travel kit with TSA-approved sizes of our most popular nano silver products. Perfect for on-the-go wellness.',
      shortDescription: 'TSA-approved travel kit with nano silver essentials',
      price: 89.99,
      comparePrice: 109.99,
      sku: 'NS-TRAVEL-KIT',
      category: 'Kits',
      images: ['/products/nano-silver-travel.jpg'],
      stock: 50,
      minOrderQuantity: 1,
      maxOrderQuantity: 3,
      weight: 300,
      dimensions: { length: 20, width: 15, height: 5, unit: 'cm' },
      specifications: [
        { label: 'Contents', value: 'Solution, Gel, Nasal, Throat Spray' },
        { label: 'Sizes', value: 'Travel size (30-60ml each)' },
        { label: 'Case', value: 'Premium travel case included' },
        { label: 'TSA Approved', value: 'Yes' },
        { label: 'Value', value: 'Save 20% vs individual purchase' },
        { label: 'Manufactured', value: 'Canada' },
      ],
      certifications: ['GMP Certified', 'Travel Safe'],
      tags: ['nano silver', 'travel kit', 'gift set', 'wellness'],
      isActive: true,
      isFeatured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rating: 4.9,
      reviewCount: 67,
    },
    {
      id: '8',
      name: 'Nano Silver Pet Solution',
      description: 'Specially formulated nano silver solution for pets. Gentle, safe, and effective for your furry companions.',
      shortDescription: 'Gentle nano silver solution formulated for pets',
      price: 39.99,
      sku: 'NS-PET-250ML',
      category: 'Pet Care',
      images: ['/products/nano-silver-pet.jpg'],
      stock: 60,
      minOrderQuantity: 1,
      maxOrderQuantity: 5,
      weight: 280,
      dimensions: { length: 7, width: 7, height: 15, unit: 'cm' },
      specifications: [
        { label: 'Concentration', value: '5 ppm (pet-safe)' },
        { label: 'Volume', value: '250ml' },
        { label: 'Suitable For', value: 'Dogs, Cats, Small Animals' },
        { label: 'Application', value: 'External/Topical use' },
        { label: 'Veterinarian', value: 'Formula reviewed' },
        { label: 'Manufactured', value: 'Canada' },
      ],
      certifications: ['Pet Safe Formula', 'Vet Reviewed'],
      tags: ['nano silver', 'pet care', 'animal health', 'gentle'],
      isActive: true,
      isFeatured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rating: 4.7,
      reviewCount: 94,
    },
  ];
}
