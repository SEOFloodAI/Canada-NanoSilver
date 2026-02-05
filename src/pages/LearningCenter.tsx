import { useState } from 'react';
import { 
  BookOpen, 
  Video, 
  FileText, 
  Play, 
  Download, 
  ChevronRight,
  GraduationCap,
  Sparkles,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LearningModule {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'lesson' | 'pdf';
  duration?: string;
  thumbnail?: string;
  category: string;
}

const learningModules: LearningModule[] = [
  {
    id: '1',
    title: 'Welcome to SilverSol™',
    description: 'An introduction to SilverSol™ technology and its benefits for wellness support.',
    type: 'video',
    duration: '5 min',
    category: 'Getting Started',
  },
  {
    id: '2',
    title: 'The Science Behind Nano Silver',
    description: 'Learn about the scientific principles that make nano silver effective.',
    type: 'lesson',
    duration: '10 min read',
    category: 'Science',
  },
  {
    id: '3',
    title: 'SilverSol™ vs Colloidal Silver',
    description: 'Understanding the key differences between SilverSol™ and traditional colloidal silver.',
    type: 'pdf',
    category: 'Education',
  },
  {
    id: '4',
    title: 'Product Usage Guidelines',
    description: 'Best practices for using SilverSol™ products safely and effectively.',
    type: 'lesson',
    duration: '8 min read',
    category: 'Getting Started',
  },
  {
    id: '5',
    title: 'Research Summaries',
    description: 'Non-medical summaries of peer-reviewed research on silver nanoparticles.',
    type: 'pdf',
    category: 'Science',
  },
  {
    id: '6',
    title: 'Safety Profile of SilverSol™',
    description: 'Comprehensive overview of SilverSol™ safety data and research.',
    type: 'video',
    duration: '12 min',
    category: 'Safety',
  },
  {
    id: '7',
    title: 'Affiliate Marketing Guide',
    description: 'Learn how to effectively promote SilverSol™ products as an affiliate.',
    type: 'lesson',
    duration: '15 min read',
    category: 'For Affiliates',
  },
  {
    id: '8',
    title: 'Distributor Training',
    description: 'Essential training for SilverSol™ distributors including sales techniques.',
    type: 'video',
    duration: '20 min',
    category: 'For Distributors',
  },
  {
    id: '9',
    title: 'Everyday Uses for SilverSol™',
    description: 'Practical applications of SilverSol™ products in daily life.',
    type: 'lesson',
    duration: '7 min read',
    category: 'Getting Started',
  },
  {
    id: '10',
    title: 'Research Trends in Nano Silver',
    description: 'Latest developments and trends in nano silver research.',
    type: 'pdf',
    category: 'Science',
  },
];

const categories = ['All', 'Getting Started', 'Science', 'Safety', 'For Affiliates', 'For Distributors', 'Education'];

export function LearningCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null);

  const filteredModules = learningModules.filter(module => {
    const matchesSearch = 
      module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || module.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'pdf':
        return <FileText className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-red-500/20 text-red-400';
      case 'pdf':
        return 'bg-blue-500/20 text-blue-400';
      default:
        return 'bg-green-500/20 text-green-400';
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
            <GraduationCap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Education Hub</span>
          </div>
          <h1 className="font-orbitron text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            SilverSol™ <span className="text-primary">Learning Center</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Welcome to the SilverSol™ Learning Center. Here you will find educational lessons 
            about SilverSol™ technology, videos explaining benefits and usage, research summaries, 
            safety guidelines, and learning modules for distributors and affiliates.
          </p>
        </div>

        {/* Welcome Content */}
        <Card className="holographic-card mb-12">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="font-orbitron text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-primary" />
                  What You'll Find Here
                </h2>
                <ul className="space-y-3">
                  {[
                    'Educational lessons about SilverSol™ technology',
                    'Videos explaining benefits and usage',
                    'Research summaries (non-medical, non-claim based)',
                    'Safety guidelines and common questions',
                    'Distributor and affiliate learning modules',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <div className="aspect-video rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <GraduationCap className="w-24 h-24 text-primary/50" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search learning materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 input-holographic"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className={cn(
                  'px-4 py-2 rounded-full border transition-all',
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-transparent border-primary/30 text-muted-foreground hover:border-primary/60'
                )}
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Modules Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((module) => (
            <Card 
              key={module.id} 
              className="holographic-card group cursor-pointer hover:scale-[1.02] transition-all"
              onClick={() => setSelectedModule(module)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    getTypeColor(module.type)
                  )}>
                    {getIcon(module.type)}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {module.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="font-orbitron font-semibold mb-2 group-hover:text-primary transition-colors">
                  {module.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {module.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {getIcon(module.type)}
                    <span className="capitalize">{module.type}</span>
                    {module.duration && (
                      <>
                        <span>•</span>
                        <span>{module.duration}</span>
                      </>
                    )}
                  </div>
                  <Button size="sm" variant="ghost" className="text-primary">
                    {module.type === 'pdf' ? (
                      <Download className="w-4 h-4" />
                    ) : module.type === 'video' ? (
                      <Play className="w-4 h-4" />
                    ) : (
                      <BookOpen className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredModules.length === 0 && (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-orbitron text-xl font-semibold mb-2">
              No materials found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {/* Module Detail Modal */}
        {selectedModule && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedModule(null)}
          >
            <Card 
              className="holographic-card max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-12 h-12 rounded-lg flex items-center justify-center',
                      getTypeColor(selectedModule.type)
                    )}>
                      {getIcon(selectedModule.type)}
                    </div>
                    <div>
                      <CardTitle className="font-orbitron">{selectedModule.title}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Badge variant="outline">{selectedModule.category}</Badge>
                        {selectedModule.duration && (
                          <span>• {selectedModule.duration}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setSelectedModule(null)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">{selectedModule.description}</p>
                
                <div className="aspect-video rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                  {selectedModule.type === 'video' ? (
                    <div className="text-center">
                      <Play className="w-16 h-16 text-primary/50 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Video preview coming soon</p>
                    </div>
                  ) : selectedModule.type === 'pdf' ? (
                    <div className="text-center">
                      <FileText className="w-16 h-16 text-primary/50 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">PDF preview coming soon</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <BookOpen className="w-16 h-16 text-primary/50 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Lesson content coming soon</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1 btn-holographic">
                    {selectedModule.type === 'pdf' ? (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </>
                    ) : selectedModule.type === 'video' ? (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Watch Video
                      </>
                    ) : (
                      <>
                        <BookOpen className="w-4 h-4 mr-2" />
                        Read Lesson
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedModule(null)}>
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

// Add missing import
import { X } from 'lucide-react';
