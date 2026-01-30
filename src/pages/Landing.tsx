import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Brain, BookOpen, Calculator, Zap, TrendingUp, Target, Clock, Award, Play, FileText, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import useSEO from '@/hooks/useSEO';

import logo from '@/assets/logo.png';
import { useAuth } from '@/hooks/useAuth';

export default function Landing() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Redirect authenticated users to home
  useEffect(() => {
    if (!loading && user) {
      navigate('/home');
    }
  }, [user, loading, navigate]);

  useSEO({
    title: "JEElytics - AI-Powered JEE Concept Strength Checker | Master Physics, Chemistry & Maths",
    description: "Master JEE concepts with AI-powered assessments. Get instant feedback, track progress, and improve with personalized study tips for Physics, Chemistry, and Mathematics.",
    canonical: "https://jeelytics-concept-check-01.lovable.app/"
  });

  return (
    <div className="min-h-screen bg-background pt-safe">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50 pt-safe">
        <div className="container mx-auto px-3 sm:px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 sm:gap-3">
              <img
                src={logo}
                alt="JEElytics logo"
                className="h-8 w-8 rounded"
                loading="eager"
              />
              <h1 className="text-xl sm:text-2xl font-bold text-gradient-primary">
                JEElytics
              </h1>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <ThemeToggle />
              <Button variant="outline" size="sm" className="hidden sm:inline-flex" onClick={() => navigate('/login')}>
                Log In
              </Button>
              <Button variant="gradient" size="sm" className="text-sm sm:text-base btn-mobile" onClick={() => navigate('/signup')}>
                <span className="sm:hidden">Start</span>
                <span className="hidden sm:inline">Sign Up</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-10 sm:py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 text-gradient-primary animate-fade-in leading-tight">
            Master JEE Concepts with AI
          </h2>
          <p className="text-base sm:text-xl md:text-2xl text-muted-foreground mb-6 sm:mb-8 animate-fade-in px-2">
            Your intelligent JEE concept strength checker. Get AI-powered assessments, instant feedback, and personalized study recommendations.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 justify-center animate-scale-in px-4">
            <Button 
              size="lg" 
              variant="gradient" 
              className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 h-auto btn-mobile w-full sm:w-auto"
              onClick={() => navigate('/signup')}
            >
              Start Free Practice 🚀
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 h-auto btn-mobile w-full sm:w-auto"
              onClick={() => navigate('/login')}
            >
              I Have an Account
            </Button>
          </div>
        </div>
      </section>

      {/* New Features Announcement */}
      <section className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border border-primary/20 rounded-xl">
          <div className="flex items-center gap-2 mb-3 sm:mb-4 justify-center">
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <h3 className="text-lg sm:text-xl font-bold text-primary">New Features!</h3>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            <div className="flex items-center gap-3 p-3 sm:p-4 bg-background/50 rounded-lg">
              <Play className="h-8 w-8 sm:h-10 sm:w-10 text-secondary flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm sm:text-base">Recorded Lectures</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Video lessons from experts</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 sm:p-4 bg-background/50 rounded-lg">
              <FileText className="h-8 w-8 sm:h-10 sm:w-10 text-accent flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm sm:text-base">Notes & Resources</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Study materials included</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 sm:p-4 bg-background/50 rounded-lg">
              <Sparkles className="h-8 w-8 sm:h-10 sm:w-10 text-primary flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm sm:text-base">More Coming Soon</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Stay tuned for updates!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

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
