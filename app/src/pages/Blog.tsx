import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Calendar, User, Tag, ArrowRight,
  TrendingUp, BookOpen
} from 'lucide-react';
import { useAuthStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  publishedAt?: string;
  createdAt: string;
  featured?: boolean;
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Understanding Nano-Structured Silver Technology',
    slug: 'understanding-nano-structured-silver',
    excerpt: 'Explore the science behind nano-structured silver and how SIVERS™ leverages cutting-edge technology for wellness support.',
    content: 'Full article content here...',
    author: 'Canada Nano Silver Team',
    category: 'Education',
    tags: ['technology', 'science', 'nano-silver'],
    status: 'published',
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    featured: true,
  },
  {
    id: '2',
    title: 'The History of Silver in Wellness',
    slug: 'history-of-silver-wellness',
    excerpt: 'From ancient civilizations to modern science - discover the journey of silver in supporting human wellness.',
    content: 'Full article content here...',
    author: 'Canada Nano Silver Team',
    category: 'History',
    tags: ['history', 'silver', 'wellness'],
    status: 'published',
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'SIVERS™ vs Traditional Colloidal Silver: What is the Difference?',
    slug: 'sivers-vs-colloidal-silver',
    excerpt: 'Learn what sets SIVERS™ apart from traditional colloidal silver products.',
    content: 'Full article content here...',
    author: 'Canada Nano Silver Team',
    category: 'Comparison',
    tags: ['comparison', 'colloidal', 'technology'],
    status: 'published',
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Research Insights: Nano-Structured Silver Studies',
    slug: 'research-insights-nano-silver',
    excerpt: 'A review of current research on nano-structured silver and its applications.',
    content: 'Full article content here...',
    author: 'Canada Nano Silver Team',
    category: 'Research',
    tags: ['research', 'studies', 'science'],
    status: 'published',
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Wellness Support: A Holistic Approach',
    slug: 'wellness-support-holistic-approach',
    excerpt: 'How SIVERS™ fits into a comprehensive wellness lifestyle.',
    content: 'Full article content here...',
    author: 'Canada Nano Silver Team',
    category: 'Wellness',
    tags: ['wellness', 'lifestyle', 'holistic'],
    status: 'published',
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'Quality Assurance at Canada Nano Silver',
    slug: 'quality-assurance-canada-nano-silver',
    excerpt: 'Our commitment to quality, safety, and transparency in every bottle.',
    content: 'Full article content here...',
    author: 'Canada Nano Silver Team',
    category: 'Quality',
    tags: ['quality', 'safety', 'transparency'],
    status: 'published',
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: '7',
    title: 'Frequently Asked Questions About SIVERS™',
    slug: 'faq-sivers',
    excerpt: 'Get answers to the most common questions about SIVERS™ products.',
    content: 'Full article content here...',
    author: 'Canada Nano Silver Team',
    category: 'FAQ',
    tags: ['faq', 'questions', 'answers'],
    status: 'published',
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: '8',
    title: 'The Future of Nano-Technology in Wellness',
    slug: 'future-nano-technology-wellness',
    excerpt: 'What is next for nano-structured silver and wellness technology?',
    content: 'Full article content here...',
    author: 'Canada Nano Silver Team',
    category: 'Innovation',
    tags: ['future', 'innovation', 'technology'],
    status: 'published',
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: '9',
    title: 'Customer Success Stories: Wellness Journeys',
    slug: 'customer-success-stories',
    excerpt: 'Real stories from real people who have incorporated SIVERS™ into their wellness routines.',
    content: 'Full article content here...',
    author: 'Canada Nano Silver Team',
    category: 'Stories',
    tags: ['stories', 'testimonials', 'wellness'],
    status: 'published',
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: '10',
    title: 'How to Choose the Right SIVERS™ Product',
    slug: 'choose-right-sivers-product',
    excerpt: 'A guide to selecting the best SIVERS™ product for your wellness needs.',
    content: 'Full article content here...',
    author: 'Canada Nano Silver Team',
    category: 'Guide',
    tags: ['guide', 'products', 'selection'],
    status: 'published',
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
];

export function Blog() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  const categories = ['all', ...Array.from(new Set(blogPosts.map(p => p.category)))];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory && post.status === 'published';
  });

  const featuredPost = filteredPosts.find(p => p.featured) || filteredPosts[0];
  const recentPosts = filteredPosts.filter(p => p.id !== featuredPost?.id).slice(0, 3);
  const otherPosts = filteredPosts.filter(p => p.id !== featuredPost?.id).slice(3);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <Badge className="mb-4">Canada Nano Silver Insights</Badge>
        <h1 className="text-4xl font-bold mb-4 font-orbitron">The Blog</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Stay informed with the latest news, research insights, and wellness tips 
          about nano-structured silver technology and the Canada Nano Silver community.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-background/50 border-primary/30"
          />
        </div>
        {isAdmin && (
          <Button onClick={() => navigate('/blog/new')} className="btn-holographic">
            Write New Post
          </Button>
        )}
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
        <TabsList className="flex flex-wrap bg-background/50">
          {categories.map(cat => (
            <TabsTrigger key={cat} value={cat} className="capitalize">
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Featured Post */}
      {featuredPost && (
        <Card className="mb-8 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer holographic-card"
          onClick={() => navigate(`/blog/${featuredPost.slug}`)}>
          <div className="grid lg:grid-cols-2">
            <div className="aspect-video lg:aspect-auto bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <BookOpen className="h-24 w-24 text-primary/50" />
            </div>
            <CardContent className="p-8 flex flex-col justify-center">
              <div className="flex items-center space-x-2 mb-3">
                <Badge>{featuredPost.category}</Badge>
                <span className="text-sm text-muted-foreground flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Featured
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-3 font-orbitron">{featuredPost.title}</h2>
              <p className="text-muted-foreground mb-4">{featuredPost.excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {featuredPost.author}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(featuredPost.publishedAt || featuredPost.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <Button variant="ghost">
                  Read More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      )}

      {/* Recent Posts Grid */}
      {recentPosts.length > 0 && (
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {recentPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow cursor-pointer holographic-card"
              onClick={() => navigate(`/blog/${post.slug}`)}>
              <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-primary/50" />
              </div>
              <CardContent className="p-4">
                <Badge variant="secondary" className="mb-2">{post.category}</Badge>
                <h3 className="font-semibold mb-2 line-clamp-2 font-orbitron">{post.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{post.excerpt}</p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* More Posts */}
      {otherPosts.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 font-orbitron">More Articles</h2>
          <div className="space-y-4">
            {otherPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow cursor-pointer holographic-card"
                onClick={() => navigate(`/blog/${post.slug}`)}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline">{post.category}</Badge>
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="font-semibold mb-1 font-orbitron">{post.title}</h3>
                      <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        {post.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-xs text-muted-foreground flex items-center">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground ml-4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Newsletter CTA */}
      <div className="mt-16 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl p-8 text-center border border-primary/20">
        <h2 className="text-2xl font-bold mb-4 font-orbitron">Stay Updated</h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          Subscribe to our newsletter for the latest articles, research updates, 
          and exclusive Canada Nano Silver insights delivered to your inbox.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input 
            placeholder="Enter your email" 
            className="bg-background/50 border-primary/30"
          />
          <Button className="btn-holographic">Subscribe</Button>
        </div>
      </div>
    </div>
  );
}
