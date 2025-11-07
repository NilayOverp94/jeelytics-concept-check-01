import { useNavigate } from 'react-router-dom';
import { Brain, BookOpen, Calculator, Zap, TrendingUp, Target, Clock, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import useSEO from '@/hooks/useSEO';

export default function Landing() {
  const navigate = useNavigate();

  useSEO({
    title: "JEElytics - AI-Powered JEE Concept Strength Checker | Master Physics, Chemistry & Maths",
    description: "Master JEE concepts with AI-powered assessments. Get instant feedback, track progress, and improve with personalized study tips for Physics, Chemistry, and Mathematics.",
    canonical: "https://jeelytics.lovable.app/"
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img
                src="/lovable-uploads/fee96b45-bf5f-4bee-8f30-d9b112d26dd9.png"
                alt="JEElytics logo - AI-powered JEE preparation platform"
                className="h-8 w-8 rounded"
                loading="eager"
              />
              <h1 className="text-2xl font-bold text-gradient-primary">
                JEElytics
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="outline" onClick={() => navigate('/login')}>
                Log In
              </Button>
              <Button variant="gradient" onClick={() => navigate('/signup')}>
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gradient-primary animate-fade-in">
            Master JEE Concepts with AI
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-fade-in">
            Your intelligent JEE concept strength checker. Get AI-powered assessments, instant feedback, and personalized study recommendations for Physics, Chemistry, and Mathematics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
            <Button 
              size="lg" 
              variant="gradient" 
              className="text-lg px-8 py-6 h-auto"
              onClick={() => navigate('/signup')}
            >
              Start Free Practice 🚀
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6 h-auto"
              onClick={() => navigate('/login')}
            >
              I Have an Account
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 bg-muted/30">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gradient-primary">
          Why Choose JEElytics?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Card className="card-jee hover:scale-105 transition-transform">
            <CardContent className="pt-6 text-center">
              <Brain className="h-12 w-12 text-primary mx-auto mb-4" aria-hidden="true" />
              <h3 className="font-semibold mb-2 text-lg">AI-Powered Questions</h3>
              <p className="text-sm text-muted-foreground">
                Fresh AI-generated questions for every test, tailored to JEE patterns and your chosen difficulty level
              </p>
            </CardContent>
          </Card>
          <Card className="card-jee hover:scale-105 transition-transform">
            <CardContent className="pt-6 text-center">
              <Zap className="h-12 w-12 text-secondary mx-auto mb-4" aria-hidden="true" />
              <h3 className="font-semibold mb-2 text-lg">Instant Results</h3>
              <p className="text-sm text-muted-foreground">
                Get immediate detailed feedback with step-by-step solutions and personalized improvement tips
              </p>
            </CardContent>
          </Card>
          <Card className="card-jee hover:scale-105 transition-transform">
            <CardContent className="pt-6 text-center">
              <TrendingUp className="h-12 w-12 text-accent mx-auto mb-4" aria-hidden="true" />
              <h3 className="font-semibold mb-2 text-lg">Track Progress</h3>
              <p className="text-sm text-muted-foreground">
                Monitor your improvement with detailed analytics, streaks, and performance history
              </p>
            </CardContent>
          </Card>
          <Card className="card-jee hover:scale-105 transition-transform">
            <CardContent className="pt-6 text-center">
              <Target className="h-12 w-12 text-primary mx-auto mb-4" aria-hidden="true" />
              <h3 className="font-semibold mb-2 text-lg">JEE Focused</h3>
              <p className="text-sm text-muted-foreground">
                Questions aligned with JEE Mains and Advanced patterns, covering all important topics
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gradient-primary">
          How JEElytics Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">1</span>
            </div>
            <h3 className="font-semibold mb-2 text-lg">Choose Your Topic</h3>
            <p className="text-muted-foreground">
              Select from Physics, Chemistry, or Mathematics subjects and pick a specific topic to practice
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-secondary">2</span>
            </div>
            <h3 className="font-semibold mb-2 text-lg">Take AI Test</h3>
            <p className="text-muted-foreground">
              Answer AI-generated questions at your preferred difficulty: CBSE, JEE Mains, or JEE Advanced
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-accent">3</span>
            </div>
            <h3 className="font-semibold mb-2 text-lg">Get Instant Feedback</h3>
            <p className="text-muted-foreground">
              Receive detailed solutions, explanations, and personalized tips to improve your understanding
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-16 bg-muted/30">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gradient-primary">
          Perfect for JEE Aspirants
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="card-jee">
            <CardContent className="pt-6 flex gap-4">
              <Clock className="h-8 w-8 text-primary flex-shrink-0" aria-hidden="true" />
              <div>
                <h3 className="font-semibold mb-2">Flexible Practice</h3>
                <p className="text-sm text-muted-foreground">
                  Choose 3, 5, or 25 question tests based on your available time and practice needs
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="card-jee">
            <CardContent className="pt-6 flex gap-4">
              <Award className="h-8 w-8 text-secondary flex-shrink-0" aria-hidden="true" />
              <div>
                <h3 className="font-semibold mb-2">Build Consistency</h3>
                <p className="text-sm text-muted-foreground">
                  Track your daily streak and stay motivated with consistent practice habits
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="card-jee">
            <CardContent className="pt-6 flex gap-4">
              <BookOpen className="h-8 w-8 text-accent flex-shrink-0" aria-hidden="true" />
              <div>
                <h3 className="font-semibold mb-2">Comprehensive Coverage</h3>
                <p className="text-sm text-muted-foreground">
                  Practice all important topics from Physics, Chemistry, and Mathematics syllabi
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="card-jee">
            <CardContent className="pt-6 flex gap-4">
              <Calculator className="h-8 w-8 text-primary flex-shrink-0" aria-hidden="true" />
              <div>
                <h3 className="font-semibold mb-2">Real Exam Pattern</h3>
                <p className="text-sm text-muted-foreground">
                  Experience MCQ and integer-type questions matching actual JEE exam formats
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12 border border-primary/20">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient-primary">
            Ready to Ace JEE?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of students improving their JEE preparation with AI-powered practice
          </p>
          <Button 
            size="lg" 
            variant="gradient" 
            className="text-lg px-8 py-6 h-auto"
            onClick={() => navigate('/signup')}
          >
            Start Your Free Practice Today 🚀
          </Button>
        </div>
      </section>

      {/* Footer with legal links */}
      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <div className="flex justify-center gap-6 mb-4">
            <a href="/disclaimer" className="hover:text-foreground transition-colors">Disclaimer</a>
            <a href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-foreground transition-colors">Terms of Use</a>
          </div>
          <p>© 2025 JEElytics. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
