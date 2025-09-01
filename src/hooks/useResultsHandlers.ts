
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Subject } from '@/types/jee';

interface UseResultsHandlersProps {
  subject: Subject;
  topic: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  conceptStrength: 'Strong' | 'Moderate' | 'Weak';
  streak: number;
  randomQuote: string;
}

export function useResultsHandlers({
  subject,
  topic,
  score,
  totalQuestions,
  percentage,
  conceptStrength,
  streak,
  randomQuote,
}: UseResultsHandlersProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleTryAgain = () => {
    navigate('/quiz', { state: { subject, topic } });
  };

  const handlePickAnother = () => {
    // Navigate to home and trigger stats refresh
    navigate('/', { state: { refresh: Date.now() } });
  };

  const handleShare = () => {
    const websiteUrl = window.location.origin;
    const message = `🎯 JEElytics Test Result!
    
📚 Subject: ${subject}
📖 Topic: ${topic}
📊 Score: ${score}/${totalQuestions} (${percentage.toFixed(0)}%)
💪 Concept Strength: ${conceptStrength}
🔥 Current Streak: ${streak} day${streak > 1 ? 's' : ''}

"${randomQuote}"

Check your concept strength at JEElytics! 🚀
${websiteUrl}`;

    if (navigator.share) {
      navigator.share({
        title: 'JEElytics Test Result',
        text: message,
        url: websiteUrl,
      }).catch(() => {
        // If native sharing fails, fallback to WhatsApp
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
      });
    } else {
      // Fallback to WhatsApp
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
    
    toast({
      title: "Result Shared!",
      description: "Your test result has been shared successfully.",
    });
  };

  const handleGoHome = () => {
    navigate('/', { state: { refresh: Date.now() } });
  };

  return {
    handleTryAgain,
    handlePickAnother,
    handleShare,
    handleGoHome,
  };
}
