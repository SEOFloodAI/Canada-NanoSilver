import { useState } from 'react';
import { 
  Search, 
  Download, 
  ExternalLink, 
  Calendar, 
  User, 
  BookOpen,
  Loader2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Microscope,
  Activity,
  Sparkles,
  AlertTriangle,
  Bug,
  Droplets,
  CircleDot
} from 'lucide-react';
import { exportToCSV } from '@/lib/utils';
import { useResearchStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { DiseaseEntry } from '@/types';

const categoryIcons: Record<string, React.ElementType> = {
  viral: Droplets,
  bacterial: CircleDot,
  parasitic: Bug,
  fungal: Activity,
  other: Activity,
};

const categoryColors: Record<string, string> = {
  viral: 'text-red-400 bg-red-400/10 border-red-400/30',
  bacterial: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
  parasitic: 'text-purple-400 bg-purple-400/10 border-purple-400/30',
  fungal: 'text-green-400 bg-green-400/10 border-green-400/30',
  other: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
};

export function ResearchPortal() {
  const [searchInput, setSearchInput] = useState('');
  const [selectedDisease, setSelectedDisease] = useState<DiseaseEntry | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const { articles, isLoading, totalCount, currentPage, searchQuery, diseaseLibrary, searchArticles, searchByDisease, clearSearch } = useResearchStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      searchArticles(searchInput.trim(), 1);
    }
  };

  const handleDiseaseClick = (disease: DiseaseEntry) => {
    setSelectedDisease(disease);
    searchByDisease(disease.id);
  };

  const handlePageChange = (page: number) => {
    if (searchQuery) {
      searchArticles(searchQuery, page);
    }
  };

  const handleExportCSV = () => {
    if (articles.length === 0) return;
    
    const data = articles.map(article => ({
      'PubMed ID': article.pmid,
      'Year': article.year,
      'Title': article.title,
      'Journal': article.journal,
      'Authors': article.authors.join(', '),
      'URL': article.url,
    }));
    
    exportToCSV(data, `sivers-research-${searchQuery || selectedDisease?.name || 'search'}-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const totalPages = Math.ceil(totalCount / 20);

  const filteredDiseases = activeCategory === 'all' 
    ? diseaseLibrary 
    : diseaseLibrary.filter(d => d.category === activeCategory);

  const categories = ['all', 'viral', 'bacterial', 'parasitic', 'fungal', 'other'];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
            <Microscope className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">SIVERS Research Database</span>
          </div>
          <h2 className="font-orbitron text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-accent">
              Scientific Research Portal
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Explore peer-reviewed studies on silver nanoparticles from PubMed. 
            Our research focuses on SIVERS technology applications against pathogens and health conditions.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="mb-8">
          <div className="bg-amber-950/50 border border-amber-500/30 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-orbitron font-semibold text-amber-400 mb-2">Research Disclaimer</h4>
                <p className="text-sm text-amber-200/90 leading-relaxed">
                  This portal provides indexed research summaries from PubMed for informational and research purposes only. 
                  The data presented does not constitute medical advice, claims of efficacy, or treatment recommendations. 
                  SIVERS products are sold for research purposes. Always consult a qualified healthcare professional for medical advice.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <Card className="holographic-card mb-8">
          <CardHeader>
            <CardTitle className="font-orbitron flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              Search Research Articles
            </CardTitle>
            <CardDescription>
              Enter a health condition, pathogen, or research topic. Your search will be combined with "silver nanoparticles OR colloidal silver AND SIVERS".
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Enter a health condition (e.g., 'wound healing', 'Staph aureus')..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10 input-holographic"
                />
              </div>
              <Button 
                type="submit" 
                className="btn-holographic"
                disabled={isLoading || !searchInput.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </>
                )}
              </Button>
              {articles.length > 0 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={clearSearch}
                  className="border-primary/30"
                >
                  Clear
                </Button>
              )}
            </form>

            {searchQuery && (
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Search Query:</span>{' '}
                  <code className="text-primary bg-primary/10 px-2 py-1 rounded">
                    (silver nanoparticles OR colloidal silver) AND ({searchQuery})
                  </code>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Disease Library */}
        {!articles.length && (
          <Card className="holographic-card mb-8">
            <CardHeader>
              <CardTitle className="font-orbitron flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                Browse by Disease/Pathogen
              </CardTitle>
              <CardDescription>
                Click on any category or disease to search for related research
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeCategory} onValueChange={setActiveCategory}>
                <TabsList className="grid grid-cols-3 sm:grid-cols-6 mb-6">
                  {categories.map((cat) => (
                    <TabsTrigger key={cat} value={cat} className="capitalize">
                      {cat}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value={activeCategory} className="mt-0">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredDiseases.map((disease) => {
                      const Icon = categoryIcons[disease.category] || Activity;
                      return (
                        <button
                          key={disease.id}
                          onClick={() => handleDiseaseClick(disease)}
                          className="group p-4 rounded-xl bg-muted/50 border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${categoryColors[disease.category]}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold group-hover:text-primary transition-colors">{disease.name}</h4>
                              <p className="text-xs text-muted-foreground mt-1">{disease.description}</p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {disease.searchTerms.slice(0, 2).map((term, i) => (
                                  <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-muted">{term}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Results Section */}
        {articles.length > 0 && (
          <Card className="holographic-card">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="font-orbitron flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Research Results
                </CardTitle>
                <CardDescription>
                  {selectedDisease ? (
                    <>Showing results for <span className="text-primary font-medium">{selectedDisease.name}</span></>
                  ) : (
                    <>Showing {articles.length} of {totalCount} results</>
                  )}
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                onClick={handleExportCSV}
                className="border-primary/30"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table className="table-holographic">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-24">PubMed ID</TableHead>
                      <TableHead className="w-20">Year</TableHead>
                      <TableHead>Article Title</TableHead>
                      <TableHead>Journal</TableHead>
                      <TableHead className="hidden md:table-cell">Authors</TableHead>
                      <TableHead className="w-20">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {articles.map((article) => (
                      <TableRow key={article.pmid}>
                        <TableCell className="font-mono text-sm">
                          {article.pmid}
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-primary/10 text-primary text-xs">
                            <Calendar className="w-3 h-3" />
                            {article.year}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <button className="text-left text-sm font-medium hover:text-primary transition-colors line-clamp-2">
                                {article.title}
                              </button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="font-orbitron text-lg">
                                  {article.title}
                                </DialogTitle>
                                <DialogDescription>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-primary/10 text-primary text-xs">
                                      <Calendar className="w-3 h-3" />
                                      {article.publicationDate}
                                    </span>
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-accent/10 text-accent text-xs">
                                      <BookOpen className="w-3 h-3" />
                                      {article.journal}
                                    </span>
                                  </div>
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                    <User className="w-4 h-4 text-primary" />
                                    Authors
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    {article.authors.join(', ')}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-primary" />
                                    Abstract
                                  </h4>
                                  <p className="text-sm text-muted-foreground leading-relaxed">
                                    {article.abstract || 'Abstract not available.'}
                                  </p>
                                </div>
                                {article.keywords && article.keywords.length > 0 && (
                                  <div>
                                    <h4 className="font-semibold text-sm mb-2">Keywords</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {article.keywords.map((keyword, i) => (
                                        <span key={i} className="px-2 py-1 rounded-full bg-muted text-xs">
                                          {keyword}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                <div className="pt-4 border-t border-border">
                                  <a
                                    href={article.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-primary hover:underline"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                    View on PubMed
                                  </a>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {article.journal}
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                          {article.authors.slice(0, 3).join(', ')}
                          {article.authors.length > 3 && ' et al.'}
                        </TableCell>
                        <TableCell>
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                            title="View on PubMed"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1 || isLoading}
                      className="border-primary/30"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages || isLoading}
                      className="border-primary/30"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
