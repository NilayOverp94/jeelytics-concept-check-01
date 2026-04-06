import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Target, Users, Brain, Zap, GraduationCap, TrendingUp, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import useSEO from '@/hooks/useSEO';

const blogPosts = [
  {
    id: 'what-is-jee',
    title: 'What is JEE and Why It Matters for Your Engineering Dreams',
    icon: GraduationCap,
    color: 'from-primary to-primary-glow',
    content: `
The Joint Entrance Examination (JEE) is India's most prestigious engineering entrance exam, conducted by the National Testing Agency (NTA). It is the gateway to top institutions like IITs, NITs, IIITs, and other centrally funded technical institutions.

**JEE Mains** is the first stage, taken by over 10 lakh students annually. It tests your understanding of Physics, Chemistry, and Mathematics at the 11th and 12th standard level. Scoring well in JEE Mains gets you into NITs, IIITs, and also qualifies you for JEE Advanced.

**JEE Advanced** is the second stage, exclusively for the top 2.5 lakh JEE Mains qualifiers. It is the only pathway to the Indian Institutes of Technology (IITs) — the dream destination for engineering aspirants across India.

### Why JEE Matters
- **Career Opportunities**: IIT/NIT graduates are recruited by top companies like Google, Microsoft, Goldman Sachs with packages ranging from ₹15 LPA to ₹1 Cr+
- **Research & Innovation**: IITs produce world-class researchers and entrepreneurs
- **Network**: The alumni network of IITs is one of the strongest globally
- **Foundation**: The rigorous preparation builds problem-solving skills that last a lifetime

### Exam Pattern (JEE Mains 2026)
- **Duration**: 3 hours
- **Subjects**: Physics, Chemistry, Mathematics (30 questions each)
- **Marking**: +4 for correct, -1 for wrong (MCQ), No negative for integer type
- **Total Marks**: 300

The key to cracking JEE is not just studying hard — it's studying smart. That's exactly what JEElytics helps you do.
    `,
  },
  {
    id: 'why-jeelytics',
    title: 'Why We Built JEElytics — Our Mission to Democratize JEE Prep',
    icon: Target,
    color: 'from-secondary to-secondary-glow',
    content: `
JEElytics was born out of a simple frustration: quality JEE preparation shouldn't cost lakhs of rupees. 

### The Problem
Most JEE aspirants come from middle-class families. The average coaching institute charges ₹1.5-4 lakhs for a 2-year program. Online platforms charge ₹15,000-50,000 per year. For many students in tier-2 and tier-3 cities, even these amounts are a stretch.

### Our Solution
We built JEElytics as a **free AI-powered platform** that gives every JEE aspirant access to:
- **AI-Generated Practice Tests**: Unlike static question banks, our AI creates fresh questions every time you practice, ensuring you never see the same question twice
- **78+ Expert Video Lectures**: Curated lectures covering the entire JEE syllabus for Physics, Chemistry, and Mathematics
- **PYQ Papers (2007-2025)**: Previous Year Question papers for JEE Mains, JEE Advanced, MHTCET, BITSAT, and NDA
- **Personal AI Tutor**: Ask any doubt, get instant explanations, and receive personalized study recommendations
- **Study Groups**: Connect with fellow aspirants, discuss doubts, and stay motivated together

### Our Philosophy
We believe that talent is equally distributed, but opportunity is not. JEElytics exists to bridge that gap. Whether you're from Mumbai or a small town in Bihar, you deserve the same quality preparation tools.

### The Team
JEElytics is built by students who've been through the JEE journey themselves. We understand the pressure, the late-night study sessions, and the need for reliable practice material. That's why every feature we build is designed with the student's perspective in mind.
    `,
  },
  {
    id: 'how-to-use',
    title: 'How to Use JEElytics Correctly — A Complete Guide',
    icon: CheckCircle,
    color: 'from-accent to-accent-glow',
    content: `
Getting the most out of JEElytics requires a strategic approach. Here's your complete guide to using every feature effectively.

### Step 1: Take Diagnostic Tests
Start by taking a 5-question test in each subject to identify your strengths and weaknesses. JEElytics will track your performance automatically.

### Step 2: Follow a Study Schedule
- **Daily**: Take at least 1-2 practice tests (15-20 minutes)
- **Weekly**: Review your weak topics using the Classes section
- **Monthly**: Attempt full-length tests with 25 questions

### Step 3: Use the AI Tutor Smartly
Our AI tutor isn't just for answering doubts — use it to:
- Ask "Explain [topic] in simple terms" for concept clarity
- Request "Give me a strategy to solve [type] problems"
- Ask "What are the most important topics in [subject] for JEE Mains?"

### Step 4: Practice with PYQ Papers
Previous Year Questions are the gold standard for JEE prep:
- Start with recent years (2023-2025) to understand the current pattern
- Work backwards to 2015 for comprehensive coverage
- Analyze which topics repeat most frequently

### Step 5: Join or Create Study Groups
- Join groups with 3-5 serious aspirants
- Share daily practice scores to stay accountable
- Discuss difficult questions together
- Use the group to stay motivated during tough phases

### Step 6: Track Your Progress
- Maintain your daily streak — consistency beats intensity
- Monitor your average scores across subjects
- Focus more time on subjects where your score is below 40%
- Use notifications to stay on track

### Pro Tips
1. **Don't skip topics** — JEE tests conceptual understanding, not selective preparation
2. **Time yourself** — JEE is as much about speed as accuracy
3. **Review wrong answers** — Understanding why you got it wrong is more valuable than getting it right
4. **Use different difficulty levels** — Start with CBSE level, then move to JEE Mains, then JEE Advanced
5. **Stay consistent** — 2 hours daily is better than 10 hours on weekends
    `,
  },
  {
    id: 'tips-and-strategy',
    title: 'JEE 2026 Preparation Strategy — Tips from Toppers',
    icon: TrendingUp,
    color: 'from-primary to-secondary',
    content: `
Cracking JEE requires a blend of smart strategy, consistent effort, and the right resources. Here's a proven roadmap.

### Time Management
- **6 months before exam**: Focus on completing syllabus and conceptual clarity
- **3 months before**: Intensive revision + daily practice tests
- **1 month before**: Full-length mock tests + PYQ papers + revision of formulae
- **Last week**: Light revision only, focus on rest and confidence

### Subject-wise Strategy

#### Physics (Most scoring)
- Focus on **Mechanics, Electrodynamics, and Optics** — these cover 60% of questions
- Practice numerical problems daily
- Understand derivations, don't just memorize
- Key chapters: Rotation, Electromagnetic Induction, Modern Physics

#### Chemistry (Quickest marks)
- **Physical Chemistry**: Practice numericals, know all formulae
- **Organic Chemistry**: Master reaction mechanisms and named reactions
- **Inorganic Chemistry**: Use mnemonics for periodic table trends
- Key chapters: Chemical Bonding, Thermodynamics, Coordination Compounds

#### Mathematics (Highest weightage)
- Focus on **Calculus** — it carries the most marks
- Practice coordinate geometry extensively
- Learn shortcuts for Algebra problems
- Key chapters: Definite Integration, Probability, Matrices & Determinants

### Common Mistakes to Avoid
1. ❌ Spending too much time on one subject
2. ❌ Not practicing enough mock tests
3. ❌ Ignoring NCERT (especially for Chemistry)
4. ❌ Not analyzing your mistakes after tests
5. ❌ Studying new topics in the last month
6. ❌ Comparing yourself with others constantly

### Mental Health Matters
- Take breaks every 45-60 minutes of study
- Exercise or play sports for at least 30 minutes daily
- Sleep 7-8 hours — your brain consolidates learning during sleep
- Talk to friends and family when stressed
- Remember: One exam doesn't define your life

### How JEElytics Helps
- AI-powered tests adapt to your level
- Smart notifications remind you when you're slacking
- PYQ analysis shows which topics are most important
- Study groups keep you accountable and motivated
- The streak system gamifies your preparation

Start your JEE preparation journey with JEElytics today — it's free, it's smart, and it's designed for students like you.
    `,
  },
];

export default function About() {
  useSEO({
    title: "About JEElytics | Free AI JEE Preparation Platform",
    description: "Learn about JEElytics — India's free AI-powered JEE preparation platform. Read our blogs about JEE, preparation strategies, and how to use JEElytics effectively.",
    canonical: "https://jeelytics-concept-check-01.lovable.app/about"
  });

  return (
    <div className="min-h-screen bg-background pt-safe">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 py-3">
          <div className="flex items-center gap-3">
            <Link to="/home">
              <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
            </Link>
            <h1 className="text-xl font-bold text-gradient-primary">About JEElytics</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-3 sm:px-4 py-8 max-w-4xl">
        {/* Hero */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gradient-primary">
            Empowering Every JEE Aspirant
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Free AI-powered JEE preparation for all. No barriers, no boundaries — just quality education accessible to everyone.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Video Lectures', value: '78+' },
            { label: 'PYQ Papers', value: '100+' },
            { label: 'AI Questions', value: '∞' },
            { label: 'Cost', value: 'Free' },
          ].map((stat) => (
            <Card key={stat.label} className="card-jee text-center">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Blog Posts */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-center mb-6">Our Blog</h2>
          {blogPosts.map((post) => {
            const Icon = post.icon;
            return (
              <Card key={post.id} id={post.id} className="card-jee overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${post.color}`} />
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${post.color} shrink-0`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold">{post.title}</h3>
                  </div>
                  <div className="prose prose-sm max-w-none text-muted-foreground dark:prose-invert">
                    {post.content.split('\n').map((line, i) => {
                      if (line.startsWith('### ')) return <h4 key={i} className="text-base font-bold text-foreground mt-4 mb-2">{line.replace('### ', '')}</h4>;
                      if (line.startsWith('#### ')) return <h5 key={i} className="text-sm font-bold text-foreground mt-3 mb-1">{line.replace('#### ', '')}</h5>;
                      if (line.startsWith('- ')) return <p key={i} className="text-sm ml-4 mb-1">• {line.replace('- ', '')}</p>;
                      if (line.match(/^\d+\./)) return <p key={i} className="text-sm ml-4 mb-1">{line}</p>;
                      if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="text-sm font-semibold text-foreground mb-1">{line.replace(/\*\*/g, '')}</p>;
                      if (line.trim() === '') return <br key={i} />;
                      return <p key={i} className="text-sm mb-1">{line.replace(/\*\*(.*?)\*\*/g, '$1')}</p>;
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link to="/signup">
            <Button variant="gradient" size="lg" className="text-lg px-8">
              Start Your Free JEE Prep Now 🚀
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
