import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name?: string;
    email?: string;
  };
  theme: {
    color: string;
  };
  handler: (response: RazorpayResponse) => void;
  modal: {
    ondismiss: () => void;
  };
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface UseRazorpayReturn {
  initiatePayment: (planId: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function useRazorpay(): UseRazorpayReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const verifyPayment = async (response: RazorpayResponse): Promise<boolean> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('razorpay-verify-payment', {
        body: {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature
        }
      });

      if (error) throw error;
      
      if (data?.success) {
        toast({
          title: "Payment Successful! 🎉",
          description: `Welcome to Premium! Your subscription is now active.`,
        });
        return true;
      } else {
        throw new Error(data?.error || 'Payment verification failed');
      }
    } catch (err: any) {
      console.error('Payment verification error:', err);
      toast({
        title: "Payment Verification Failed",
        description: err.message || "Please contact support if amount was deducted.",
        variant: "destructive"
      });
      return false;
    }
  };

  const initiatePayment = useCallback(async (planId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Check if Razorpay is loaded
      if (!window.Razorpay) {
        throw new Error('Payment service not available. Please refresh the page.');
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Please login to subscribe');
      }

      // Create order
      const { data: orderData, error: orderError } = await supabase.functions.invoke('razorpay-create-order', {
        body: { plan_id: planId }
      });

      if (orderError) {
        console.error('Order creation error:', orderError);
        throw new Error(orderError.message || 'Failed to create order');
      }

      if (!orderData?.order_id) {
        throw new Error('Invalid order response');
      }

      console.log('Order created:', orderData);

      // Configure Razorpay checkout
      const options: RazorpayOptions = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'JEElytics',
        description: `${orderData.plan_name} Subscription`,
        order_id: orderData.order_id,
        prefill: {
          name: orderData.user_name,
          email: orderData.user_email
        },
        theme: {
          color: '#6366f1' // Primary color
        },
        handler: async (response: RazorpayResponse) => {
          console.log('Payment successful:', response);
          setIsLoading(true);
          await verifyPayment(response);
          setIsLoading(false);
          // Reload page to refresh subscription status
          window.location.reload();
        },
        modal: {
          ondismiss: () => {
            console.log('Payment modal dismissed');
            setIsLoading(false);
            toast({
              title: "Payment Cancelled",
              description: "You can try again anytime.",
            });
          }
        }
      };

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (err: any) {
      console.error('Payment initiation error:', err);
      setError(err.message);
      toast({
        title: "Payment Error",
        description: err.message || "Failed to initiate payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    initiatePayment,
    isLoading,
    error
  };
}
