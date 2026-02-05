import { useEffect, useRef } from 'react';
import { ArrowRight, FlaskConical, Microscope, BookOpen, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      opacity: number;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles = [];
      const particleCount = Math.min(50, Math.floor(window.innerWidth / 30));
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.2,
        });
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw particles
      particles.forEach((particle, i) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 255, ${particle.opacity})`;
        ctx.fill();

        // Draw connections
        particles.slice(i + 1).forEach((other) => {
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(0, 255, 255, ${0.1 * (1 - distance / 150)})`;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(drawParticles);
    };

    resize();
    createParticles();
    drawParticles();

    window.addEventListener('resize', () => {
      resize();
      createParticles();
    });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ background: 'linear-gradient(135deg, #0a0f1c 0%, #0d1a2d 50%, #0a1628 100%)' }}
      />

      {/* Grid Overlay */}
      <div className="absolute inset-0 grid-bg opacity-50 z-[1]" />

      {/* Hexagon Pattern */}
      <div className="absolute inset-0 hex-pattern opacity-30 z-[1]" />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/20 to-background z-[2]" />
      <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-primary/5 to-transparent z-[2]" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent/5 to-transparent z-[2]" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Natural Wellness Solutions
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-orbitron text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="text-foreground">Advancing</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-accent">
                Nano Silver Research
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8">
              Discover the power of ultra-small 3-5nm silver nanoparticles for your wellness journey. 
              Premium natural health products backed by science, manufactured to the highest standards 
              for you and your family.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="btn-holographic group"
                asChild
              >
                <Link to="/research">
                  <Microscope className="w-5 h-5 mr-2" />
                  Explore Research
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary/50 hover:bg-primary/10"
                asChild
              >
                <Link to="/products">
                  <FlaskConical className="w-5 h-5 mr-2" />
                  View Products
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-border/50">
              <div>
                <div className="font-orbitron text-2xl sm:text-3xl font-bold text-primary">
                  10K+
                </div>
                <div className="text-sm text-muted-foreground">Research Articles</div>
              </div>
              <div>
                <div className="font-orbitron text-2xl sm:text-3xl font-bold text-primary">
                  50+
                </div>
                <div className="text-sm text-muted-foreground">Years of Science</div>
              </div>
              <div>
                <div className="font-orbitron text-2xl sm:text-3xl font-bold text-primary">
                  100%
                </div>
                <div className="text-sm text-muted-foreground">Peer Reviewed</div>
              </div>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative hidden lg:block">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Central Circle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-64 h-64">
                  {/* Outer Ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-pulse" />
                  <div className="absolute inset-4 rounded-full border border-primary/20" />
                  <div className="absolute inset-8 rounded-full border border-accent/20" />
                  
                  {/* Inner Content */}
                  <div className="absolute inset-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <div className="text-center">
                      <FlaskConical className="w-16 h-16 text-primary mx-auto mb-2" />
                      <span className="font-orbitron text-sm text-primary/80">RESEARCH</span>
                    </div>
                  </div>

                  {/* Orbiting Elements */}
                  <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3">
                      <div className="w-6 h-6 rounded-full bg-primary shadow-lg shadow-primary/50" />
                    </div>
                  </div>
                  <div className="absolute inset-0 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-3">
                      <div className="w-4 h-4 rounded-full bg-accent shadow-lg shadow-accent/50" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute top-10 right-0 p-4 glass rounded-xl holographic-border">
                <BookOpen className="w-6 h-6 text-primary mb-2" />
                <div className="text-sm font-medium">PubMed Index</div>
                <div className="text-xs text-muted-foreground">Real-time Search</div>
              </div>

              <div className="absolute bottom-20 left-0 p-4 glass rounded-xl holographic-border">
                <Microscope className="w-6 h-6 text-accent mb-2" />
                <div className="text-sm font-medium">Lab Tested</div>
                <div className="text-xs text-muted-foreground">Quality Assured</div>
              </div>

              <div className="absolute top-1/2 -right-4 p-4 glass rounded-xl holographic-border">
                <Sparkles className="w-6 h-6 text-cyan-400 mb-2" />
                <div className="text-sm font-medium">3-5nm</div>
                <div className="text-xs text-muted-foreground">Particle Size</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-[3]" />
    </section>
  );
}
