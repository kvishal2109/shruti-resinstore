# Coupon System Guide

## Available Coupons

The following coupons are currently available in the system:

1. **WELCOME10**
   - 10% discount
   - Minimum purchase: ₹500
   - Maximum discount: ₹200

2. **SAVE20**
   - 20% discount
   - Minimum purchase: ₹1000
   - Maximum discount: ₹500

3. **FLAT100**
   - Flat ₹100 off
   - Minimum purchase: ₹500

4. **FLAT500**
   - Flat ₹500 off
   - Minimum purchase: ₹2000

5. **NEWUSER**
   - 15% discount
   - No minimum purchase
   - Maximum discount: ₹300

## How Customers Use Coupons

1. Add products to cart
2. Go to checkout page
3. In the "Order Summary" section, find "Have a coupon code?"
4. Enter the coupon code
5. Click "Apply" button
6. Discount will be applied automatically
7. Total amount will update

## Features

- ✅ Real-time discount calculation
- ✅ Minimum purchase validation
- ✅ Maximum discount limits (for percentage coupons)
- ✅ Visual feedback when coupon is applied
- ✅ Easy coupon removal
- ✅ Discount shown in order summary
- ✅ Coupon code saved in order

## Adding New Coupons

Edit `lib/data/coupons.ts` and add new coupon objects:

```typescript
{
  code: "YOURCODE",
  discountType: "percentage", // or "fixed"
  discountValue: 15, // 15% or ₹15
  minPurchase: 1000, // Optional
  maxDiscount: 500, // Optional (for percentage)
  isActive: true,
}
```

## Future Enhancements

When admin panel is ready:
- Move coupons to Firebase
- Add expiration dates
- Add usage limits per customer
- Add category-specific coupons
- Track coupon usage analytics

