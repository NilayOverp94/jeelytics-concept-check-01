

# Phase 2: Razorpay Payment Integration

## Security First

Your Razorpay credentials will be stored as encrypted Supabase secrets:
- `RAZORPAY_KEY_ID` → `rzp_live_SDVTINuTBSUwq5`  
- `RAZORPAY_KEY_SECRET` → (your secret key)

These are **LIVE keys** - real payments will be processed. Consider testing carefully before going public.

---

## Implementation Steps

### Step 1: Store Razorpay Secrets
Add both credentials as Supabase secrets for use in edge functions.

### Step 2: Create Edge Functions

**`razorpay-create-order`**
- Creates a Razorpay order when user clicks "Subscribe"
- Returns `order_id` for frontend checkout
- Stores pending order in `user_subscriptions`

**`razorpay-verify-payment`**  
- Verifies payment signature after successful payment
- Activates subscription in database
- Sets `expires_at` based on plan duration

### Step 3: Frontend Integration

**Add Razorpay Checkout Script** (`index.html`)
```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

**Create Payment Hook** (`src/hooks/useRazorpay.ts`)
- Handles checkout flow
- Calls edge functions
- Updates UI on success/failure

### Step 4: Remove "New Features" Box
Delete the announcement box from Home.tsx (lines 215-247) as requested.

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `supabase/functions/razorpay-create-order/index.ts` | Create |
| `supabase/functions/razorpay-verify-payment/index.ts` | Create |
| `index.html` | Add Razorpay script |
| `src/hooks/useRazorpay.ts` | Create |
| `src/hooks/useSubscription.ts` | Create |
| `src/pages/Home.tsx` | Remove announcement box |

---

## Payment Flow

```text
┌─────────────────────────────────────────────────────────────┐
│                      User clicks "Subscribe"                 │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  Frontend calls razorpay-create-order edge function         │
│  → Creates Razorpay order                                   │
│  → Stores pending subscription in DB                        │
│  → Returns order_id                                         │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  Razorpay Checkout opens (payment modal)                    │
│  → User completes payment (UPI/Card/NetBanking)             │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  Frontend calls razorpay-verify-payment                     │
│  → Verifies signature with Razorpay                         │
│  → Activates subscription                                   │
│  → Sets expiry date                                         │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  User is now Premium! Unlimited tests + PYQ access          │
└─────────────────────────────────────────────────────────────┘
```

---

## After This Phase

Once payment integration is complete, we'll proceed to:
- Phase 3: Access control (test limits, PYQ lock)
- Phase 4: Pricing page and upgrade prompts

