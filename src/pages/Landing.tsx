import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dumbbell, Utensils, Brain, Heart, ArrowRight, Sparkles, Target, Calendar } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-hero)' }}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-display font-bold">FitFeast AI</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Log In</Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-primary hover:bg-primary/90">
                Get Started
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 animate-fade-in">
            <Brain className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered Health Companion</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Your Journey to
            <span className="gradient-text block">Holistic Wellness</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Personalized workout plans and delicious recipes powered by AI. 
            Transform your health with smart recommendations tailored just for you.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Link to="/signup">
              <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-glow text-lg px-8">
                Start Free Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="text-lg px-8">
                I Already Have an Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Everything You Need for a Healthier Life
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Our AI analyzes your goals and preferences to create the perfect plan for you.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Dumbbell className="w-8 h-8" />}
              title="Smart Workouts"
              description="AI-generated 7-day workout plans tailored to your fitness goals and experience level."
              delay="0s"
            />
            <FeatureCard
              icon={<Utensils className="w-8 h-8" />}
              title="Recipe Generator"
              description="Turn your available ingredients into delicious, nutritious meals with step-by-step instructions."
              delay="0.1s"
            />
            <FeatureCard
              icon={<Target className="w-8 h-8" />}
              title="Goal Tracking"
              description="Monitor your progress with calorie targets and personalized recommendations."
              delay="0.2s"
            />
            <FeatureCard
              icon={<Calendar className="w-8 h-8" />}
              title="Weekly Planning"
              description="Combine workouts and meals into a comprehensive weekly plan you can export."
              delay="0.3s"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              How FitFeast AI Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Three simple steps to transform your health journey
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="01"
              title="Set Your Goals"
              description="Tell us about yourself - your fitness goals, dietary preferences, and current stats."
            />
            <StepCard
              number="02"
              title="Get AI Recommendations"
              description="Our AI generates personalized workout plans and recipes based on your unique profile."
            />
            <StepCard
              number="03"
              title="Track & Achieve"
              description="Save your favorites, track progress, and export your weekly plan for easy reference."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="bg-primary text-primary-foreground overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
            <CardContent className="p-12 text-center relative z-10">
              <Heart className="w-12 h-12 mx-auto mb-6 animate-pulse-soft" />
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Ready to Transform Your Life?
              </h2>
              <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto mb-8">
                Join thousands of users who have already started their journey to better health with FitFeast AI.
              </p>
              <Link to="/signup">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  Get Started for Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold">FitFeast AI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} FitFeast AI. Your health, powered by intelligence.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  delay: string;
}) {
  return (
    <Card className="card-hover animate-fade-in" style={{ animationDelay: delay }}>
      <CardContent className="p-6">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
          {icon}
        </div>
        <h3 className="text-lg font-display font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardContent>
    </Card>
  );
}

function StepCard({ number, title, description }: { 
  number: string; 
  title: string; 
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-display font-bold flex items-center justify-center mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-xl font-display font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
