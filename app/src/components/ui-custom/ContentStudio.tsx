import { useState } from 'react';
import { 
  FileText, Mail, Share2, Download, Copy, 
  Sparkles, Eye, Save, Trash2, AlertTriangle, Smartphone
} from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import { useAuthStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

const complianceWords = [
  'cure', 'treat', 'disease', 'medicine', 'prescription', 'diagnose', 
  'heal', 'medication', 'drug', 'therapy', 'antibiotic', 'kills bacteria',
  'prevents', 'cures', 'treats'
];

interface ContentTemplate {
  id: string;
  name: string;
  type: 'social' | 'ad' | 'email' | 'blog' | 'guide';
  description: string;
  defaultContent: string;
}

const templates: ContentTemplate[] = [
  {
    id: 'social-1',
    name: 'Social Media Post',
    type: 'social',
    description: 'Short, engaging post for social platforms',
    defaultContent: '🌟 Discover the power of SIVERS™ Nano Silver! 🌟\n\nAdvanced nano-structured silver technology designed for modern wellness support. Backed by research, trusted by thousands.\n\n✓ Broad-spectrum wellness support\n✓ Strong safety profile\n✓ Cutting-edge nano-technology\n\nLearn more at CanadaNanoSilver.com\n\n#SIVERS #NanoSilver #Wellness #CanadaNanoSilver #NaturalSupport',
  },
  {
    id: 'ad-1',
    name: 'Ad Copy',
    type: 'ad',
    description: 'Compliant advertisement copy',
    defaultContent: 'Support Your Wellness with SIVERS™ Nano Silver\n\nAdvanced nano-structured silver technology designed for modern wellness needs. Backed by research, trusted by thousands.\n\n✓ Broad-spectrum wellness support\n✓ Advanced nano-technology\n✓ Research-backed formulation\n✓ Strong safety profile\n\n*This product is not intended to diagnose, treat, cure, or prevent any disease.\n\nShop Now at CanadaNanoSilver.com',
  },
  {
    id: 'email-1',
    name: 'Email Newsletter',
    type: 'email',
    description: 'Email marketing template',
    defaultContent: 'Subject: Discover SIVERS™ Nano Silver - Advanced Wellness Support\n\nHi [Name],\n\nWe wanted to share something exciting with you - SIVERS™, a revolutionary nano-structured silver formula designed for modern wellness support.\n\nWhat makes SIVERS™ different?\n• Advanced nano-technology for optimal stability\n• Research-backed formulation\n• Strong safety profile\n• Quality assured manufacturing\n\nAs someone who values wellness, we think you will appreciate the science behind SIVERS™.\n\n[Shop Now - CanadaNanoSilver.com]\n\nTo your wellness,\nThe Canada Nano Silver Team\n\nP.S. SIVERS™ products are not intended to diagnose, treat, cure, or prevent any disease. Always consult a healthcare professional for medical advice.',
  },
  {
    id: 'blog-1',
    name: 'Blog Article',
    type: 'blog',
    description: 'Long-form educational content',
    defaultContent: '# Understanding SIVERS™ Nano Silver Technology\n\nIn the world of wellness support, nano-structured silver has emerged as a fascinating area of research...\n\n## What is SIVERS™?\n\nSIVERS™ represents the cutting edge of nano-structured silver technology...\n\n## The Science Behind Nano-Structured Silver\n\n[Educational content about the technology]\n\n## Why Choose SIVERS™?\n\n• Advanced formulation\n• Research-backed\n• Quality assured\n\n*Note: This information is for educational purposes only. Consult a healthcare professional for medical advice.*',
  },
  {
    id: 'guide-1',
    name: 'Product Guide',
    type: 'guide',
    description: 'Distributor product information guide',
    defaultContent: '# SIVERS™ Product Guide\n\n## Product Overview\n\nSIVERS™ is an advanced nano-structured silver formula designed for wellness support...\n\n## Key Selling Points\n\n1. Advanced nano-technology\n2. Research-backed formulation\n3. Strong safety profile\n4. Broad-spectrum wellness support\n\n## Compliance Notes\n\n- Always refer to the product as SIVERS™ (with trademark)\n- No medical claims\n- Direct health questions to professionals\n- Focus on wellness support and technology',
  },
];

interface ContentDraft {
  id: string;
  title: string;
  content: string;
  type: 'social' | 'ad' | 'email' | 'blog' | 'guide';
  createdAt: string;
  updatedAt: string;
}

export function ContentStudio() {
  const [title, setTitle] = useState('');
  const [selectedType, setSelectedType] = useState<ContentTemplate['type']>('social');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [showComplianceWarnings, setShowComplianceWarnings] = useState(true);
  const [complianceIssues, setComplianceIssues] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [drafts, setDrafts] = useState<ContentDraft[]>([]);

  const { user } = useAuthStore();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing your content here...',
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      checkCompliance(editor.getText());
    },
  });

  const checkCompliance = (text: string) => {
    if (!showComplianceWarnings) {
      setComplianceIssues([]);
      return;
    }

    const lowerText = text.toLowerCase();
    const issues = complianceWords.filter(word => lowerText.includes(word.toLowerCase()));
    setComplianceIssues(issues);
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template && editor) {
      editor.commands.setContent(template.defaultContent);
    }
  };

  const generateWithAI = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const prompts: Record<string, string> = {
      social: `🌟 Discover SIVERS™ Nano Silver - Advanced Technology! 🌟\n\nLooking for cutting-edge wellness support? SIVERS™ uses proprietary nano-technology to deliver broad-spectrum wellness support backed by research.\n\n✨ Why Choose SIVERS™?\n✓ Advanced nano-structured formula\n✓ Strong safety profile\n✓ Quality assured manufacturing\n✓ Research-backed technology\n\nLearn more: CanadaNanoSilver.com\n\n#SIVERS #NanoSilver #Wellness #CanadaNanoSilver`,
      
      ad: `Support Your Wellness with SIVERS™ Nano Silver\n\nExperience the power of advanced nano-structured silver technology. SIVERS™ is designed for those seeking cutting-edge wellness support.\n\nKey Benefits:\n• Broad-spectrum wellness support\n• Advanced nano-technology\n• Research-backed formulation\n• Strong safety profile\n\n*This product is not intended to diagnose, treat, cure, or prevent any disease.\n\nShop Now: CanadaNanoSilver.com`,
      
      email: `Subject: Discover SIVERS™ - Advanced Wellness Support\n\nHi [Name],\n\nWe are excited to introduce you to SIVERS™ - our revolutionary nano-structured silver formula designed to support your wellness journey.\n\nWhat makes SIVERS™ different?\n• Advanced nano-technology for optimal stability\n• Research-backed formulation\n• Strong safety profile\n• Quality assured manufacturing\n\n[Shop Now - CanadaNanoSilver.com]\n\nTo your wellness,\nThe Canada Nano Silver Team`,
      
      blog: `# Understanding SIVERS™ Nano Silver Technology\n\nIn the evolving landscape of wellness support, nano-structured silver has emerged as a fascinating area of research and development. Today, we are exploring SIVERS™ - an advanced formulation that is changing how people think about silver-based wellness products.\n\n## What is Nano-Structured Silver?\n\nNano-structured silver refers to silver particles engineered at the nanometer scale. This technology allows for enhanced properties compared to traditional colloidal silver, including improved stability and effectiveness.\n\n## The SIVERS™ Difference\n\nSIVERS™ represents the cutting edge of this technology:\n\n- **Advanced Formulation**: Proprietary nano-structuring process\n- **Research-Backed**: Supported by scientific studies\n- **Quality Assured**: Manufactured to the highest standards\n- **Safety Focused**: Designed with consumer safety in mind\n\n*Disclaimer: This article is for educational purposes only. SIVERS™ products are not intended to diagnose, treat, cure, or prevent any disease. Consult a healthcare professional before use.*`,
      
      guide: `# SIVERS™ Product Guide\n\n## Overview\n\nSIVERS™ is an advanced nano-structured silver formula designed for wellness support. This guide provides essential information for understanding and promoting SIVERS™ products.\n\n## Key Features\n\n- Nano-structured silver technology\n- Enhanced stability formula\n- Research-backed development\n- Quality assured manufacturing\n\n## Compliance Guidelines\n\nWhen promoting SIVERS™:\n\n✓ Always refer to the product as "SIVERS™" (with trademark)\n✓ Focus on wellness support, not medical claims\n✓ Include appropriate disclaimers\n✓ Direct medical questions to healthcare professionals\n\n✗ Never claim the product treats, cures, or prevents disease\n✗ Never suggest it replaces medical treatment\n✗ Never make unsubstantiated claims`,
    };

    const generatedContent = prompts[selectedType] || prompts.social;
    editor?.commands.setContent(generatedContent);
    setIsGenerating(false);
    toast.success('AI generated content ready!');
  };

  const saveDraft = () => {
    if (!title || !editor?.getText()) {
      toast.error('Please add a title and content');
      return;
    }

    const newDraft: ContentDraft = {
      id: Date.now().toString(),
      title,
      content: editor.getHTML(),
      type: selectedType,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setDrafts(prev => [...prev, newDraft]);
    toast.success('Draft saved successfully!');
    setTitle('');
    editor?.commands.clearContent();
  };

  const copyToClipboard = () => {
    const content = editor?.getText() || '';
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard!');
  };

  const exportAs = (format: 'txt' | 'html' | 'md') => {
    const content = editor?.getHTML() || '';
    let blob: Blob;
    let filename: string;

    switch (format) {
      case 'html':
        blob = new Blob([content], { type: 'text/html' });
        filename = `${title || 'content'}.html`;
        break;
      case 'md':
        blob = new Blob([editor?.getText() || ''], { type: 'text/markdown' });
        filename = `${title || 'content'}.md`;
        break;
      default:
        blob = new Blob([editor?.getText() || ''], { type: 'text/plain' });
        filename = `${title || 'content'}.txt`;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported as ${format.toUpperCase()}!`);
  };

  const filteredTemplates = templates.filter(t => t.type === selectedType);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-orbitron">Content Studio</h2>
          <p className="text-muted-foreground">
            Create compliant promotional content for SIVERS™ products
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={showComplianceWarnings}
            onCheckedChange={setShowComplianceWarnings}
          />
          <Label className="text-sm">Compliance Check</Label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Settings */}
        <Card className="lg:col-span-1 holographic-card">
          <CardHeader>
            <CardTitle className="text-lg font-orbitron">Content Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Content Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter content title..."
                className="bg-background/50 border-primary/30"
              />
            </div>

            <div>
              <Label>Content Type</Label>
              <Select value={selectedType} onValueChange={(v) => setSelectedType(v as ContentTemplate['type'])}>
                <SelectTrigger className="bg-background/50 border-primary/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="social">
                    <div className="flex items-center">
                      <Share2 className="h-4 w-4 mr-2" />
                      Social Media Post
                    </div>
                  </SelectItem>
                  <SelectItem value="ad">
                    <div className="flex items-center">
                      <Smartphone className="h-4 w-4 mr-2" />
                      Ad Copy
                    </div>
                  </SelectItem>
                  <SelectItem value="email">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Newsletter
                    </div>
                  </SelectItem>
                  <SelectItem value="blog">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Blog Article
                    </div>
                  </SelectItem>
                  <SelectItem value="guide">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Product Guide
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Template</Label>
              <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                <SelectTrigger className="bg-background/50 border-primary/30">
                  <SelectValue placeholder="Select a template..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None (Start from scratch)</SelectItem>
                  {filteredTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={generateWithAI}
              disabled={isGenerating}
              className="w-full btn-holographic"
              variant="outline"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate with AI
                </>
              )}
            </Button>

            {complianceIssues.length > 0 && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                <div className="flex items-center text-yellow-400 mb-2">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <span className="font-medium text-sm">Compliance Warning</span>
                </div>
                <p className="text-xs text-yellow-400/80 mb-2">
                  Potentially problematic words detected:
                </p>
                <div className="flex flex-wrap gap-1">
                  {complianceIssues.map((word) => (
                    <Badge key={word} variant="outline" className="text-xs bg-yellow-500/20 border-yellow-500/30 text-yellow-400">
                      {word}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Center Panel - Editor */}
        <Card className="lg:col-span-2 holographic-card">
          <CardHeader className="border-b border-primary/20">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-orbitron">Editor</CardTitle>
              <div className="flex items-center space-x-2">
                <Tabs value={previewMode} onValueChange={(v) => setPreviewMode(v as 'desktop' | 'mobile')}>
                  <TabsList className="h-8 bg-background/50">
                    <TabsTrigger value="desktop" className="px-3">
                      <Eye className="h-4 w-4" />
                    </TabsTrigger>
                    <TabsTrigger value="mobile" className="px-3">
                      <Smartphone className="h-4 w-4" />
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="edit" className="w-full">
              <TabsList className="w-full justify-start rounded-none border-b border-primary/20 px-4 bg-background/30">
                <TabsTrigger value="edit">Edit</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              
              <TabsContent value="edit" className="m-0">
                <div className="p-4">
                  {/* Toolbar */}
                  <div className="flex flex-wrap gap-1 mb-4 p-2 bg-background/30 rounded-lg border border-primary/20">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => editor?.chain().focus().toggleBold().run()}
                      className={editor?.isActive('bold') ? 'bg-primary/20' : ''}
                    >
                      <strong>B</strong>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => editor?.chain().focus().toggleItalic().run()}
                      className={editor?.isActive('italic') ? 'bg-primary/20' : ''}
                    >
                      <em>I</em>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                      className={editor?.isActive('heading', { level: 1 }) ? 'bg-primary/20' : ''}
                    >
                      H1
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                      className={editor?.isActive('heading', { level: 2 }) ? 'bg-primary/20' : ''}
                    >
                      H2
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => editor?.chain().focus().toggleBulletList().run()}
                      className={editor?.isActive('bulletList') ? 'bg-primary/20' : ''}
                    >
                      • List
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                      className={editor?.isActive('orderedList') ? 'bg-primary/20' : ''}
                    >
                      1. List
                    </Button>
                  </div>

                  {/* Editor */}
                  <div className="min-h-[300px] border border-primary/20 rounded-lg p-4 bg-background/30 prose prose-invert max-w-none">
                    <EditorContent editor={editor} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="preview" className="m-0">
                <div className={`p-4 ${previewMode === 'mobile' ? 'max-w-sm mx-auto' : ''}`}>
                  <div className="border border-primary/20 rounded-lg p-4 bg-background">
                    {selectedType === 'social' && (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-10 h-10 rounded-full bg-primary/20" />
                          <div>
                            <p className="font-semibold text-sm">Your Name</p>
                            <p className="text-xs text-muted-foreground">Just now</p>
                          </div>
                        </div>
                        <div 
                          className="text-sm whitespace-pre-wrap"
                          dangerouslySetInnerHTML={{ __html: editor?.getHTML() || '' }}
                        />
                        <div className="flex space-x-4 text-muted-foreground text-sm">
                          <span>Like</span>
                          <span>Comment</span>
                          <span>Share</span>
                        </div>
                      </div>
                    )}
                    
                    {selectedType === 'email' && (
                      <div className="space-y-3">
                        <div className="border-b border-primary/20 pb-2">
                          <p className="text-sm"><strong>From:</strong> you@example.com</p>
                          <p className="text-sm"><strong>To:</strong> subscriber@example.com</p>
                          <p className="text-sm"><strong>Subject:</strong> {title || 'No Subject'}</p>
                        </div>
                        <div 
                          className="text-sm whitespace-pre-wrap"
                          dangerouslySetInnerHTML={{ __html: editor?.getHTML() || '' }}
                        />
                      </div>
                    )}
                    
                    {(selectedType === 'blog' || selectedType === 'guide' || selectedType === 'ad') && (
                      <div className="space-y-3">
                        <h1 className="text-xl font-bold font-orbitron">{title || 'Untitled'}</h1>
                        <div 
                          className="prose prose-invert prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: editor?.getHTML() || '' }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={saveDraft} className="btn-holographic">
          <Save className="h-4 w-4 mr-2" />
          Save Draft
        </Button>
        <Button variant="outline" onClick={copyToClipboard} className="border-primary/30">
          <Copy className="h-4 w-4 mr-2" />
          Copy
        </Button>
        <Button variant="outline" onClick={() => exportAs('txt')} className="border-primary/30">
          <Download className="h-4 w-4 mr-2" />
          Export TXT
        </Button>
        <Button variant="outline" onClick={() => exportAs('html')} className="border-primary/30">
          <Download className="h-4 w-4 mr-2" />
          Export HTML
        </Button>
      </div>

      {/* Saved Drafts */}
      {drafts.length > 0 && (
        <Card className="holographic-card">
          <CardHeader>
            <CardTitle className="text-lg font-orbitron">Your Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-48">
              <div className="space-y-2">
                {drafts.map((draft) => (
                  <div
                    key={draft.id}
                    className="flex items-center justify-between p-3 border border-primary/20 rounded-lg hover:bg-primary/5"
                  >
                    <div>
                      <p className="font-medium">{draft.title}</p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Badge variant="outline">{draft.type}</Badge>
                        <span>{new Date(draft.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
