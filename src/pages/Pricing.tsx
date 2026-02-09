import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, Crown, Zap, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSubscription } from '@/hooks/useSubscription';
import { useRazorpay } from '@/hooks/useRazorpay';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import useSEO from '@/hooks/useSEO';
import logo from '@/assets/logo.png';

export default function Pricing() {
  useSEO({
    title: "Pricing | JEElytics - Upgrade to Premium",
    description: "Choose your JEElytics plan. Get unlimited tests and access to all PYQ papers with our affordable premium plans.",
    canonical: "https://jeelytics-concept-check-01.lovable.app/pricing"
  });

  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { plans, isPremium, subscription, isLoading } = useSubscription();
  const { initiatePayment, isLoading: isPaymentLoading } = useRazorpay();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to subscribe to a plan.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    setSelectedPlan(planId);
    try {
      await initiatePayment(planId);
    } catch (error) {
      console.error('Payment error:', error);
    }
    setSelectedPlan(null);
  };

  const monthlyPlan = plans.find(p => p.name === 'monthly');
  const yearlyPlan = plans.find(p => p.name === 'yearly');

  const features = {
    free: [
      { text: '10 Tests per month', included: true },
      { text: 'Physics, Chemistry, Math', included: true },
      { text: 'Basic AI Questions', included: true },
      { text: 'Progress Tracking', included: true },
      { text: 'PYQ Papers Access', included: false },
      { text: 'Unlimited Tests', included: false },
      { text: 'Priority AI Generation', included: false },
    ],
    premium: [
      { text: 'Unlimited Tests', included: true },
      { text: 'Physics, Chemistry, Math', included: true },
      { text: 'Advanced AI Questions', included: true },
      { text: 'Progress Tracking', included: true },
      { text: 'All PYQ Papers Access', included: true },
      { text: 'Priority AI Generation', included: true },
      { text: 'Detailed Analytics', included: true },
    ],
  };

  if (isPremium) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/home')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Link to="/home" className="flex items-center gap-2">
                <img src={logo} alt="JEElytics" className="h-8 w-8 rounded" />
                <span className="text-xl font-bold text-gradient-primary">JEElytics</span>
              </Link>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12 max-w-2xl">
          <Card className="card-jee">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400">
                <Crown className="h-8 w-8 text-black" />
              </div>
              <CardTitle className="text-2xl">You're a Premium Member!</CardTitle>
              <CardDescription>
                Thank you for supporting JEElytics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-amber-500/10 to-yellow-400/10 rounded-lg p-6 border border-amber-500/20">
                <h3 className="font-semibold mb-2">Your Plan: {subscription?.plan?.display_name || 'Premium'}</h3>
                {subscription?.expires_at && (
                  <p className="text-sm text-muted-foreground">
                    Valid until: {new Date(subscription.expires_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Your Benefits:</h4>
                <ul className="space-y-2">
                  {features.premium.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary" />
                      <span>{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button variant="outline" className="w-full" onClick={() => navigate('/home')}>
                Continue to Dashboard
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Link to="/home" className="flex items-center gap-2">
              <img src={logo} alt="JEElytics" className="h-8 w-8 rounded" />
              <span className="text-xl font-bold text-gradient-primary">JEElytics</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-gradient-primary">
            Unlock Your Full Potential
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get unlimited access to AI-powered practice tests and comprehensive PYQ papers from 2007-2025
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
          {/* Free Plan */}
          <Card className="card-jee relative">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-muted-foreground" />
                Free
              </CardTitle>
              <CardDescription>Get started with basics</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">₹0</span>
                <span className="text-muted-foreground">/forever</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {features.free.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    {feature.included ? (
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    )}
                    <span className={!feature.included ? 'text-muted-foreground line-through' : ''}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full" disabled>
                Current Plan
              </Button>
            </CardContent>
          </Card>

          {/* Monthly Plan */}
          <Card className="card-jee relative border-primary/50 shadow-lg">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                Most Popular
              </span>
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-amber-500" />
                Monthly Premium
              </CardTitle>
              <CardDescription>Perfect for focused prep</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">₹{monthlyPlan?.price_inr || 29}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {features.premium.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>{feature.text}</span>
                  </li>
                ))}
              </ul>
              <Button 
                variant="gradient" 
                className="w-full"
                onClick={() => monthlyPlan && handleSubscribe(monthlyPlan.id)}
                disabled={isPaymentLoading || isLoading || !monthlyPlan}
              >
                {isPaymentLoading && selectedPlan === monthlyPlan?.id ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <>
                    <Crown className="h-4 w-4 mr-2" />
                    Subscribe Monthly
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Yearly Plan */}
          <Card className="card-jee relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-yellow-400 text-black text-xs font-semibold px-4 py-1">
              Save 69%
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-amber-500" />
                Yearly Premium
              </CardTitle>
              <CardDescription>Best value for JEE prep</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">₹{yearlyPlan?.price_inr || 109}</span>
                <span className="text-muted-foreground">/year</span>
                <p className="text-xs text-muted-foreground mt-1">
                  Just ₹{Math.round((yearlyPlan?.price_inr || 109) / 12)}/month
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {features.premium.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>{feature.text}</span>
                  </li>
                ))}
              </ul>
              <Button 
                variant="gradient" 
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black hover:from-amber-600 hover:to-yellow-500"
                onClick={() => yearlyPlan && handleSubscribe(yearlyPlan.id)}
                disabled={isPaymentLoading || isLoading || !yearlyPlan}
              >
                {isPaymentLoading && selectedPlan === yearlyPlan?.id ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <>
                    <Crown className="h-4 w-4 mr-2" />
                    Subscribe Yearly
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Why Premium Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Why Go Premium?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 rounded-lg bg-card border border-border">
              <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 w-fit">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Unlimited Tests</h3>
              <p className="text-sm text-muted-foreground">
                Practice as much as you want without any limits
              </p>
            </div>
            <div className="text-center p-6 rounded-lg bg-card border border-border">
              <div className="mx-auto mb-4 p-3 rounded-full bg-secondary/10 w-fit">
                <Clock className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-semibold mb-2">19 Years of PYQs</h3>
              <p className="text-sm text-muted-foreground">
                Access papers from 2007-2025 for JEE Advanced
              </p>
            </div>
            <div className="text-center p-6 rounded-lg bg-card border border-border">
              <div className="mx-auto mb-4 p-3 rounded-full bg-accent/10 w-fit">
                <Crown className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">Priority AI</h3>
              <p className="text-sm text-muted-foreground">
                Faster question generation with priority queue
              </p>
            </div>
            <div className="text-center p-6 rounded-lg bg-card border border-border">
              <div className="mx-auto mb-4 p-3 rounded-full bg-amber-500/10 w-fit">
                <Shield className="h-6 w-6 text-amber-500" />
              </div>
              <h3 className="font-semibold mb-2">Secure Payments</h3>
              <p className="text-sm text-muted-foreground">
                Powered by Razorpay with bank-grade security
              </p>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="text-center mt-12 text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            <Shield className="h-4 w-4" />
            Secure payments powered by Razorpay • Cancel anytime
          </p>
        </div>
      </main>
    </div>
  );
}
