import { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Tag, 
  Search, 
  ChevronRight,
  Play,
  Eye,
  Share2,
  Bookmark
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  videoUrl?: string;
  tags: string[];
  authorName: string;
  authorAvatar?: string;
  publishedAt: string;
  readTime: string;
  viewCount: number;
  category: string;
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'What Is SilverSol™ Technology?',
    slug: 'what-is-silversol-technology',
    excerpt: 'Discover the revolutionary nano-structured silver technology that is changing the wellness industry.',
    content: 'Full article content...',
    tags: ['SilverSol™', 'Technology', 'Education'],
    authorName: 'SilverSol™ Team',
    publishedAt: '2026-01-15',
    readTime: '5 min read',
    viewCount: 1250,
    category: 'Education',
  },
  {
    id: '2',
    title: 'The Science Behind Nano-Silver (Explained Simply)',
    slug: 'science-behind-nano-silver',
    excerpt: 'A beginner-friendly explanation of how nano-silver works at the molecular level.',
    content: 'Full article content...',
    tags: ['Science', 'Education', 'Nano Silver'],
    authorName: 'Dr. Research Team',
    publishedAt: '2026-01-12',
    readTime: '8 min read',
    viewCount: 980,
    category: 'Science',
  },
  {
    id: '3',
    title: 'How SilverSol™ Differs From Regular Colloidal Silver',
    slug: 'silversol-vs-colloidal-silver',
    excerpt: 'Understanding the key differences that make SilverSol™ the superior choice.',
    content: 'Full article content...',
    tags: ['Comparison', 'SilverSol™', 'Colloidal Silver'],
    authorName: 'SilverSol™ Team',
    publishedAt: '2026-01-10',
    readTime: '6 min read',
    viewCount: 1450,
    category: 'Education',
  },
  {
    id: '4',
    title: 'Top 10 Benefits of Silver-Based Wellness Products',
    slug: 'top-10-benefits-silver-wellness',
    excerpt: 'Explore the many ways silver-based products can support your wellness journey.',
    content: 'Full article content...',
    tags: ['Benefits', 'Wellness', 'Top 10'],
    authorName: 'Wellness Expert',
    publishedAt: '2026-01-08',
    readTime: '7 min read',
    viewCount: 2100,
    category: 'Wellness',
  },
  {
    id: '5',
    title: 'The Safety Profile of SilverSol™',
    slug: 'silversol-safety-profile',
    excerpt: 'A comprehensive look at the safety research and data behind SilverSol™ products.',
    content: 'Full article content...',
    tags: ['Safety', 'Research', 'SilverSol™'],
    authorName: 'Safety Team',
    publishedAt: '2026-01-05',
    readTime: '10 min read',
    viewCount: 890,
    category: 'Safety',
  },
  {
    id: '6',
    title: 'How Affiliates Can Earn with SilverSol™',
    slug: 'affiliates-earn-silversol',
    excerpt: 'Learn about our affiliate program and how you can start earning commissions today.',
    content: 'Full article content...',
    videoUrl: 'https://example.com/video',
    tags: ['Affiliate', 'Business', 'Earning'],
    authorName: 'Marketing Team',
    publishedAt: '2026-01-03',
    readTime: '5 min read',
    viewCount: 3200,
    category: 'Business',
  },
  {
    id: '7',
    title: 'Distributor Success Tips',
    slug: 'distributor-success-tips',
    excerpt: 'Proven strategies for SilverSol™ distributors to grow their business.',
    content: 'Full article content...',
    tags: ['Distributor', 'Business', 'Success'],
    authorName: 'Sales Team',
    publishedAt: '2026-01-01',
    readTime: '8 min read',
    viewCount: 1100,
    category: 'Business',
  },
  {
    id: '8',
    title: 'Why Nano-Structured Silver Is the Future',
    slug: 'nano-silver-future',
    excerpt: 'Exploring the cutting-edge research and future applications of nano-silver technology.',
    content: 'Full article content...',
    tags: ['Future', 'Technology', 'Innovation'],
    authorName: 'Research Team',
    publishedAt: '2025-12-28',
    readTime: '6 min read',
    viewCount: 1650,
    category: 'Science',
  },
  {
    id: '9',
    title: 'Everyday Uses for SilverSol™ Products',
    slug: 'everyday-uses-silversol',
    excerpt: 'Practical ways to incorporate SilverSol™ into your daily wellness routine.',
    content: 'Full article content...',
    tags: ['Usage', 'Wellness', 'Daily Routine'],
    authorName: 'Lifestyle Team',
    publishedAt: '2025-12-25',
    readTime: '5 min read',
    viewCount: 2300,
    category: 'Wellness',
  },
  {
    id: '10',
    title: 'Research Trends in Nano Silver',
    slug: 'research-trends-nano-silver',
    excerpt: 'The latest discoveries and trends in nano silver research from around the world.',
    content: 'Full article content...',
    tags: ['Research', 'Trends', 'Science'],
    authorName: 'Research Team',
    publishedAt: '2025-12-20',
    readTime: '9 min read',
    viewCount: 780,
    category: 'Science',
  },
];

const categories = ['All', 'Education', 'Science', 'Wellness', 'Safety', 'Business'];

export function Blog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Latest Updates</span>
          </div>
          <h1 className="font-orbitron text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            SilverSol™ <span className="text-primary">Blog</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stay informed with the latest news, research, and insights about SilverSol™ technology 
            and nano silver wellness products.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 input-holographic"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent justify-center">
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

        {/* Featured Post */}
        {!searchQuery && selectedCategory === 'All' && !selectedPost && (
          <Card className="holographic-card mb-12 overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="aspect-video md:aspect-auto bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <Play className="w-16 h-16 text-primary/50" />
              </div>
              <div className="p-8">
                <Badge className="mb-4">Featured</Badge>
                <h2 className="font-orbitron text-2xl font-semibold mb-3">
                  What Is SilverSol™ Technology?
                </h2>
                <p className="text-muted-foreground mb-4">
                  Discover the revolutionary nano-structured silver technology that is changing 
                  the wellness industry. Learn about the science, benefits, and what makes 
                  SilverSol™ different from traditional colloidal silver.
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    January 15, 2026
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    5 min read
                  </span>
                </div>
                <Button className="btn-holographic">
                  Read Article
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Card 
              key={post.id} 
              className="holographic-card group cursor-pointer hover:scale-[1.02] transition-all"
              onClick={() => setSelectedPost(post)}
            >
              <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center relative overflow-hidden">
                {post.videoUrl ? (
                  <>
                    <Play className="w-12 h-12 text-primary/50" />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-red-500/80">Video</Badge>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                      <span className="font-orbitron text-2xl text-primary">
                        {post.title.charAt(0)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {post.category}
                  </Badge>
                </div>
                <h3 className="font-orbitron font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(post.publishedAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {post.viewCount.toLocaleString()}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mt-3">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span 
                      key={tag} 
                      className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-orbitron text-xl font-semibold mb-2">
              No articles found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {/* Post Detail Modal */}
        {selectedPost && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto"
            onClick={() => setSelectedPost(null)}
          >
            <Card 
              className="holographic-card max-w-3xl w-full my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                {selectedPost.videoUrl ? (
                  <div className="text-center">
                    <Play className="w-20 h-20 text-primary/50 mx-auto mb-2" />
                    <p className="text-muted-foreground">Video player coming soon</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                      <span className="font-orbitron text-4xl text-primary">
                        {selectedPost.title.charAt(0)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-8">
                <div className="flex items-center gap-2 mb-4">
                  <Badge>{selectedPost.category}</Badge>
                  {selectedPost.videoUrl && (
                    <Badge className="bg-red-500/80">Video</Badge>
                  )}
                </div>
                <h2 className="font-orbitron text-2xl sm:text-3xl font-bold mb-4">
                  {selectedPost.title}
                </h2>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {selectedPost.authorName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(selectedPost.publishedAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {selectedPost.readTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {selectedPost.viewCount.toLocaleString()} views
                  </span>
                </div>
                <div className="prose prose-invert max-w-none mb-6">
                  <p className="text-lg text-muted-foreground">{selectedPost.excerpt}</p>
                  <p className="text-muted-foreground">
                    Full article content would be displayed here. This is a placeholder 
                    for the complete blog post content including rich text, images, and 
                    any embedded media.
                  </p>
                  <p className="text-muted-foreground">
                    SilverSol™ technology represents a significant advancement in nano silver 
                    formulations. Unlike traditional colloidal silver, SilverSol™ uses a patented 
                    metallic silver particle with a unique oxide coating that enhances stability, 
                    bio-compatibility, and effectiveness.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedPost.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Button className="flex-1 btn-holographic">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Article
                  </Button>
                  <Button variant="outline">
                    <Bookmark className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedPost(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
