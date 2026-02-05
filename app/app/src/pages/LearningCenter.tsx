import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, Play, CheckCircle, Clock, 
  ChevronRight, Award, GraduationCap, FileText, Lock
} from 'lucide-react';
import { useAuthStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface Lesson {
  id: string;
  title: string;
  content: string;
  videoUrl?: string;
  pdfUrl?: string;
  order: number;
  duration?: number;
}

interface LearningModule {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

const modules: LearningModule[] = [
  {
    id: '1',
    title: 'Introduction to SIVERS™ Nano Silver',
    description: 'Learn the fundamentals of SIVERS™ technology and its applications.',
    order: 1,
    lessons: [
      {
        id: 'l1-1',
        title: 'What is SIVERS™?',
        content: `SIVERS™ represents the cutting edge of nano-structured silver technology. Unlike traditional colloidal silver, SIVERS™ features a unique nano-structured formulation that provides enhanced stability and effectiveness.

## Key Characteristics

- **Nano-structured particles**: Engineered at the nanoscale for optimal performance
- **Enhanced stability**: Remains stable longer than conventional formulations
- **Research-backed**: Supported by scientific studies and quality testing
- **Safety-focused**: Designed with consumer safety as a top priority

## Understanding the Technology

SIVERS™ utilizes advanced manufacturing processes to create silver particles with specific nano-scale structures. This technology represents years of research and development in the field of nano-materials.`,
        order: 1,
        duration: 10,
      },
      {
        id: 'l1-2',
        title: 'The Science of Nano-Structured Silver',
        content: `The science behind nano-structured silver is fascinating and represents a significant advancement in materials technology.

## Nano-Technology Basics

Nano-technology involves working with materials at the nanometer scale (one billionth of a meter). At this scale, materials can exhibit unique properties different from their bulk counterparts.

## SIVERS™ Innovation

Our proprietary process creates nano-structured silver with:
- Precise particle size distribution
- Enhanced surface area
- Improved stability characteristics
- Consistent quality batch-to-batch

## Research and Development

SIVERS™ technology is the result of extensive research in nano-materials science, with ongoing studies to further understand and optimize the technology.`,
        order: 2,
        duration: 15,
      },
      {
        id: 'l1-3',
        title: 'SIVERS™ vs Traditional Colloidal Silver',
        content: `Understanding the differences between SIVERS™ and traditional colloidal silver helps appreciate the technological advancement.

## Traditional Colloidal Silver

- Silver particles suspended in liquid
- Variable particle sizes
- Can settle over time
- May degrade with light exposure

## SIVERS™ Advantages

- **Nano-structured formulation**: Precisely engineered particles
- **Superior stability**: Maintains consistency longer
- **Enhanced properties**: Optimized for wellness support
- **Quality assured**: Rigorous testing and manufacturing standards

## Making the Choice

When selecting a silver product, consider the technology, manufacturing standards, and quality assurance practices of the manufacturer.`,
        order: 3,
        duration: 12,
      },
    ],
  },
  {
    id: '2',
    title: 'Wellness Support Fundamentals',
    description: 'Explore how SIVERS™ supports overall wellness in a holistic approach.',
    order: 2,
    lessons: [
      {
        id: 'l2-1',
        title: 'Wellness and Nano-Structured Silver',
        content: `SIVERS™ is designed to support overall wellness as part of a healthy lifestyle.

## Wellness Support Concept

Wellness support means providing the body with tools and resources that may help maintain optimal function. SIVERS™ is formulated with this philosophy in mind.

## Broad-Spectrum Support

The nano-structured silver in SIVERS™ is designed to provide broad-spectrum wellness support, meaning it may help support various aspects of overall health.

## Integrative Approach

For best results, SIVERS™ should be used as part of a comprehensive wellness program that includes:
- Balanced nutrition
- Regular exercise
- Adequate sleep
- Stress management
- Regular healthcare checkups`,
        order: 1,
        duration: 10,
      },
      {
        id: 'l2-2',
        title: 'Safety and Quality Assurance',
        content: `Safety and quality are paramount in SIVERS™ manufacturing and use.

## Manufacturing Standards

SIVERS™ is produced in facilities that follow strict quality control protocols:
- GMP-certified manufacturing
- Regular third-party testing
- Batch consistency verification
- Purity assurance

## Safety Profile

Research on nano-structured silver indicates a strong safety profile when used as directed. However, it's important to:
- Follow label directions
- Consult healthcare professionals
- Not exceed recommended amounts
- Store properly

## Quality Indicators

Look for these quality indicators in silver products:
- Clear labeling
- Manufacturing transparency
- Third-party testing
- Professional recommendations`,
        order: 2,
        duration: 15,
      },
    ],
  },
  {
    id: '3',
    title: 'Product Usage Guidelines',
    description: 'Learn proper usage and best practices for SIVERS™ products.',
    order: 3,
    lessons: [
      {
        id: 'l3-1',
        title: 'Getting Started with SIVERS™',
        content: `Starting your SIVERS™ wellness journey is simple when you follow these guidelines.

## First Steps

1. **Read the label**: Understand the product and its intended use
2. **Consult a professional**: Speak with a healthcare provider about your wellness goals
3. **Start gradually**: Begin with recommended amounts
4. **Monitor your response**: Pay attention to how you feel

## Best Practices

- Store in a cool, dry place
- Keep out of direct sunlight
- Use consistently for best results
- Combine with healthy lifestyle choices

## What to Expect

Individual responses to wellness products vary. Some people notice benefits quickly, while others may take longer to observe changes. Patience and consistency are key.`,
        order: 1,
        duration: 8,
      },
      {
        id: 'l3-2',
        title: 'Dosage and Administration',
        content: `Proper usage is essential for getting the most from your SIVERS™ products.

## General Guidelines

Always follow the specific instructions on your product label. General considerations include:

- **Timing**: Some users prefer morning, others evening
- **With or without food**: Check product-specific recommendations
- **Consistency**: Regular use typically yields best results
- **Hydration**: Drink plenty of water throughout the day

## Special Considerations

- Pregnant or nursing women should consult healthcare providers
- Children require adjusted amounts
- Those with medical conditions should seek professional advice
- Interactions with medications should be discussed with doctors

## Tracking Your Journey

Consider keeping a wellness journal to track your SIVERS™ usage and any observations about your overall well-being.`,
        order: 2,
        duration: 12,
      },
    ],
  },
  {
    id: '4',
    title: 'Research and Evidence',
    description: 'Explore the scientific research behind nano-structured silver technology.',
    order: 4,
    lessons: [
      {
        id: 'l4-1',
        title: 'Current Research on Nano-Structured Silver',
        content: `Scientific research on nano-structured silver continues to expand our understanding of this technology.

## Research Areas

Current studies explore:
- Particle size and effectiveness
- Stability characteristics
- Safety profiles
- Potential applications
- Mechanisms of action

## Study Types

Research includes:
- Laboratory studies
- In vitro experiments
- Safety assessments
- Quality analyses
- Comparative studies

## Understanding Research

When evaluating research, consider:
- Study design and methodology
- Peer review status
- Sample sizes
- Conflict of interests
- Replication of results

*Note: This section is for educational purposes. SIVERS™ makes no medical claims based on research.*`,
        order: 1,
        duration: 15,
      },
      {
        id: 'l4-2',
        title: 'Quality Testing and Certification',
        content: `SIVERS™ products undergo rigorous testing to ensure quality and consistency.

## Testing Protocols

Our quality assurance includes:
- Purity testing
- Particle size analysis
- Stability testing
- Microbial screening
- Heavy metal testing

## Third-Party Verification

Independent laboratories verify:
- Product specifications
- Label accuracy
- Safety parameters
- Quality consistency

## Certificates of Analysis

Each batch of SIVERS™ comes with documentation of its quality testing results, ensuring transparency and accountability.`,
        order: 2,
        duration: 10,
      },
    ],
  },
];

export function LearningCenter() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('learningProgress');
    if (saved) {
      setProgress(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
    const completed = Object.values(progress).filter(Boolean).length;
    setOverallProgress(totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0);
  }, [progress]);

  const getLessonStatus = (lessonId: string) => {
    return progress[lessonId] || false;
  };

  const handleMarkComplete = (lessonId: string) => {
    const newProgress = { ...progress, [lessonId]: true };
    setProgress(newProgress);
    localStorage.setItem('learningProgress', JSON.stringify(newProgress));
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <Badge className="mb-4">Free Educational Resource</Badge>
        <h1 className="text-4xl font-bold mb-4 font-orbitron">Learning Center</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Master the science behind SIVERS™ technology and learn how to maximize your wellness journey. 
          Our comprehensive courses are designed for everyone from beginners to advanced users.
        </p>
      </div>

      {/* Progress Overview */}
      {isAuthenticated && (
        <Card className="mb-8 holographic-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg font-orbitron">Your Learning Progress</h3>
                  <p className="text-sm text-muted-foreground">
                    {Object.values(progress).filter(Boolean).length} of {modules.reduce((acc, m) => acc + m.lessons.length, 0)} lessons completed
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold font-orbitron">{overallProgress}%</p>
                <p className="text-sm text-muted-foreground">Complete</p>
              </div>
            </div>
            <Progress value={overallProgress} className="mt-4" />
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Course Modules Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 holographic-card">
            <CardContent className="p-0">
              <div className="p-4 border-b border-primary/20">
                <h3 className="font-semibold font-orbitron">Course Modules</h3>
              </div>
              <ScrollArea className="h-[600px]">
                <Accordion type="multiple" className="w-full">
                  {modules.map((module) => (
                    <AccordionItem key={module.id} value={module.id} className="border-b border-primary/10">
                      <AccordionTrigger className="px-4 py-3 hover:bg-primary/5">
                        <div className="flex items-center text-left">
                          <BookOpen className="h-4 w-4 mr-2 text-primary" />
                          <div>
                            <p className="font-medium text-sm">{module.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {module.lessons.length} lessons
                            </p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-1 px-4 pb-4">
                          {module.lessons.map((lesson) => {
                            const isCompleted = getLessonStatus(lesson.id);
                            return (
                              <button
                                key={lesson.id}
                                onClick={() => setSelectedLesson(lesson.id)}
                                className={`w-full flex items-center p-2 rounded-lg text-left text-sm transition-colors ${
                                  selectedLesson === lesson.id
                                    ? 'bg-primary/10'
                                    : 'hover:bg-primary/5'
                                }`}
                              >
                                {isCompleted ? (
                                  <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                                ) : (
                                  <Play className="h-4 w-4 mr-2 text-muted-foreground" />
                                )}
                                <span className="flex-1 truncate">{lesson.title}</span>
                                {lesson.duration && (
                                  <span className="text-xs text-muted-foreground flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {lesson.duration}m
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Lesson Content */}
        <div className="lg:col-span-2">
          {selectedLesson ? (
            <LessonViewer
              lessonId={selectedLesson}
              onMarkComplete={() => handleMarkComplete(selectedLesson)}
              isCompleted={getLessonStatus(selectedLesson)}
            />
          ) : (
            <Card className="h-full flex items-center justify-center holographic-card">
              <CardContent className="text-center p-12">
                <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2 font-orbitron">Select a Lesson</h3>
                <p className="text-muted-foreground">
                  Choose a lesson from the sidebar to start learning about SIVERS™ technology.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Resources Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6 font-orbitron">Additional Resources</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="holographic-card">
            <CardContent className="p-6">
              <FileText className="h-10 w-10 mb-4 text-blue-400" />
              <h3 className="font-semibold mb-2 font-orbitron">Research Papers</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Access scientific studies and research on nano-structured silver technology.
              </p>
              <Button variant="outline" className="w-full border-primary/30" onClick={() => navigate('/research')}>
                Browse Papers
              </Button>
            </CardContent>
          </Card>
          <Card className="holographic-card">
            <CardContent className="p-6">
              <Award className="h-10 w-10 mb-4 text-green-400" />
              <h3 className="font-semibold mb-2 font-orbitron">Certification Program</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Become a certified SIVERS™ product specialist with our training program.
              </p>
              <Button variant="outline" className="w-full border-primary/30">
                Learn More
              </Button>
            </CardContent>
          </Card>
          <Card className="holographic-card">
            <CardContent className="p-6">
              <Play className="h-10 w-10 mb-4 text-purple-400" />
              <h3 className="font-semibold mb-2 font-orbitron">Video Library</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Watch expert interviews, product demonstrations, and educational videos.
              </p>
              <Button variant="outline" className="w-full border-primary/30">
                Watch Videos
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

interface LessonViewerProps {
  lessonId: string;
  onMarkComplete: () => void;
  isCompleted: boolean;
}

function LessonViewer({ lessonId, onMarkComplete, isCompleted }: LessonViewerProps) {
  const lesson = modules
    .flatMap(m => m.lessons)
    .find(l => l.id === lessonId);

  const module = modules.find(m => m.lessons.some(l => l.id === lessonId));

  if (!lesson) return null;

  return (
    <Card className="holographic-card">
      <CardContent className="p-6">
        <div className="mb-6">
          <Badge variant="secondary" className="mb-2">{module?.title}</Badge>
          <h2 className="text-2xl font-bold font-orbitron">{lesson.title}</h2>
          {lesson.duration && (
            <p className="text-sm text-muted-foreground flex items-center mt-1">
              <Clock className="h-4 w-4 mr-1" />
              {lesson.duration} minutes
            </p>
          )}
        </div>

        {lesson.videoUrl && (
          <div className="aspect-video bg-muted rounded-lg mb-6 flex items-center justify-center border border-primary/20">
            <div className="text-center">
              <Play className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">Video content would play here</p>
            </div>
          </div>
        )}

        <div className="prose prose-invert max-w-none">
          {lesson.content.split('\n').map((paragraph, i) => {
            if (paragraph.startsWith('## ')) {
              return <h3 key={i} className="text-xl font-semibold mt-6 mb-3 font-orbitron">{paragraph.replace('## ', '')}</h3>;
            }
            if (paragraph.startsWith('- ')) {
              return <li key={i} className="ml-4">{paragraph.replace('- ', '')}</li>;
            }
            if (paragraph.trim() === '') {
              return null;
            }
            return <p key={i} className="mb-4">{paragraph}</p>;
          })}
        </div>

        {lesson.pdfUrl && (
          <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-400" />
                <span className="font-medium">Downloadable PDF</span>
              </div>
              <Button variant="outline" size="sm" className="border-primary/30">
                Download
              </Button>
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-primary/20 flex justify-between items-center">
          <Button variant="outline" className="border-primary/30">
            <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
            Previous Lesson
          </Button>
          {isCompleted ? (
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <CheckCircle className="h-4 w-4 mr-1" />
              Completed
            </Badge>
          ) : (
            <Button onClick={onMarkComplete} className="btn-holographic">
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark as Complete
            </Button>
          )}
          <Button variant="outline" className="border-primary/30">
            Next Lesson
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
