

# JEElytics Premium Subscription System

## Overview

Implement a freemium model with Razorpay integration for premium subscriptions featuring:
- **Free users**: 2 tests per day, Classes and Tests access only
- **Premium users**: Unlimited tests + full PYQ section access
- **Pricing**: Monthly (Rs. 99/month) + Yearly (Rs. 799/year, save 33%)

---

## Phase 1: Database Schema

### 1.1 Create Subscription Plans Table

```sql
CREATE TABLE public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,                    -- 'monthly', 'yearly'
  display_name TEXT NOT NULL,            -- 'Monthly Plan', 'Yearly Plan'
  price_inr INTEGER NOT NULL,            -- 9900 (paise), 79900 (paise)
  duration_days INTEGER NOT NULL,        -- 30, 365
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 1.2 Create User Subscriptions Table

```sql
CREATE TABLE public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  plan_id UUID REFERENCES subscription_plans(id),
  razorpay_subscription_id TEXT,
  razorpay_payment_id TEXT,
  status TEXT NOT NULL DEFAULT 'inactive', -- 'active', 'expired', 'cancelled'
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 1.3 Add Daily Test Tracking

Extend `user_stats` table:
```sql
ALTER TABLE public.user_stats
ADD COLUMN tests_today INTEGER DEFAULT 0,
ADD COLUMN last_test_reset_date DATE;
```

### 1.4 Security Definer Functions

Create functions to check subscription status and daily limits:
- `is_premium_user(user_id)` - returns boolean
- `can_take_test(user_id)` - checks daily limit for free users
- `increment_daily_test_count(user_id)` - increments counter

---

## Phase 2: Razorpay Integration

### 2.1 Setup Requirements

Razorpay requires these credentials (to be stored as Supabase secrets):
- `RAZORPAY_KEY_ID` - Public key for frontend
- `RAZORPAY_KEY_SECRET` - Secret key for backend verification

You can obtain these from: https://dashboard.razorpay.com/app/keys

### 2.2 Edge Functions

**Create `razorpay-create-order`**:
- Creates Razorpay order for subscription
- Returns order_id for frontend checkout

**Create `razorpay-verify-payment`**:
- Verifies payment signature
- Updates user_subscriptions table
- Handles webhook callbacks

**Create `razorpay-webhook`**:
- Handles subscription lifecycle events
- Auto-renewal, cancellation, failures

### 2.3 Frontend Integration

- Add Razorpay checkout script to index.html
- Create subscription selection UI
- Handle payment flow in frontend

---

## Phase 3: Access Control Implementation

### 3.1 Premium Hook

Create `useSubscription` hook:
```typescript
// Returns: { isPremium, subscription, testsRemaining, loading }
```

### 3.2 Test Limit Enforcement

Modify Quiz page to:
1. Check if user is premium OR has tests remaining today
2. Block test start if limit reached
3. Increment daily counter after test completion

### 3.3 PYQ Section Lock

Modify PYQSection component:
1. Check premium status
2. Show blur overlay + upgrade CTA for free users
3. Allow full access for premium users

### 3.4 Daily Reset Logic

Database trigger to reset `tests_today` counter at midnight IST

---

## Phase 4: UI Components

### 4.1 Pricing Page

New `/pricing` route with:
- Plan comparison cards
- Monthly vs Yearly toggle
- Feature checklist
- Payment button

### 4.2 Upgrade Prompts

- PYQ section: "Unlock PYQ Papers - Upgrade to Premium"
- Test limit: "You've used 2/2 free tests today. Upgrade for unlimited!"
- Profile dropdown: Show subscription status

### 4.3 Subscription Management

- View current plan status
- Expiry date display
- Cancel/renew options (future enhancement)

---

## Technical Details

### File Changes Required

| File | Changes |
|------|---------|
| `src/hooks/useSubscription.ts` | New hook for subscription state |
| `src/pages/Pricing.tsx` | New pricing page |
| `src/pages/Home.tsx` | Add test limit check before starting |
| `src/pages/Quiz.tsx` | Verify access before loading |
| `src/components/PYQSection.tsx` | Add premium gate |
| `src/components/UpgradeModal.tsx` | New upgrade prompt component |
| `supabase/functions/razorpay-create-order/` | New edge function |
| `supabase/functions/razorpay-verify-payment/` | New edge function |
| `supabase/functions/razorpay-webhook/` | New edge function |

### Database Migrations

1. Create `subscription_plans` table with seed data
2. Create `user_subscriptions` table with RLS policies
3. Alter `user_stats` for daily tracking
4. Create security definer functions
5. Create reset trigger for daily limits

### Security Considerations

- All payment verification server-side (edge functions)
- RLS policies on subscription tables
- Webhook signature verification
- No client-side subscription status manipulation

---

## Implementation Order

1. Database schema + RLS policies
2. Add Razorpay secrets
3. Create edge functions for payment flow
4. Create `useSubscription` hook
5. Add daily test limit logic
6. Lock PYQ section for free users
7. Create Pricing page
8. Add upgrade prompts throughout UI
9. Testing and refinement

---

## Estimated Complexity

- **Database**: Medium (4 migrations)
- **Backend**: High (3 edge functions + webhook handling)
- **Frontend**: Medium (1 new page, modify 4 existing components)
- **Integration**: Razorpay documentation and testing

This plan provides a complete subscription system while maintaining backward compatibility for existing users.

