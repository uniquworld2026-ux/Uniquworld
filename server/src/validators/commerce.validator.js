const { z } = require('zod');

const addressBody = z.object({
  type: z.enum(['shipping', 'billing', 'both']).optional(),
  fullName: z.string().min(2).max(150),
  phone: z.string().min(8).max(20),
  line1: z.string().min(3).max(255),
  line2: z.string().max(255).optional().nullable(),
  city: z.string().min(2).max(100),
  state: z.string().min(2).max(100),
  postalCode: z.string().min(4).max(20),
  country: z.string().max(100).optional(),
  isDefault: z.boolean().optional(),
});

const updateAddressSchema = addressBody.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field is required' }
);

const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().max(100).optional().nullable(),
  phone: z.string().min(8).max(20).optional().nullable(),
  avatarUrl: z.string().url().optional().nullable(),
});

const orderItemSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  catalogKey: z.string().optional(),
  productId: z.union([z.string(), z.number()]).optional().nullable(),
  variantId: z.string().uuid().optional().nullable(),
  name: z.string().optional(),
  productName: z.string().optional(),
  sku: z.string().optional(),
  price: z.number().nonnegative().optional(),
  unitPrice: z.number().nonnegative().optional(),
  quantity: z.number().int().positive().default(1),
  image: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  meta: z.record(z.any()).optional(),
});

const shippingAddressSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(8),
  line1: z.string().min(3),
  line2: z.string().optional().nullable(),
  city: z.string().min(2),
  state: z.string().min(2),
  postalCode: z.string().min(4),
  country: z.string().optional(),
});

const placeOrderSchema = z
  .object({
    items: z.array(orderItemSchema).min(1),
    addressId: z.string().uuid().optional(),
    shippingAddress: shippingAddressSchema.optional(),
    paymentMethod: z
      .enum(['cod', 'upi', 'card', 'netbanking', 'wallet'])
      .default('upi'),
    notes: z.string().max(500).optional().nullable(),
  })
  .refine((d) => d.addressId || d.shippingAddress, {
    message: 'addressId or shippingAddress is required',
  });

const verifyPaymentSchema = z.object({
  orderId: z.string().uuid(),
  razorpayOrderId: z.string().min(3),
  razorpayPaymentId: z.string().min(3),
  razorpaySignature: z.string().min(3),
});

const cancelOrderSchema = z.object({
  reason: z.string().max(500).optional(),
});

const returnSchema = z.object({
  reason: z.string().min(5).max(500),
  notes: z.string().max(1000).optional().nullable(),
});

const wishlistSchema = z.object({
  catalogKey: z.string().min(1).max(160),
  productId: z.string().uuid().optional().nullable(),
  product: z
    .object({
      id: z.union([z.string(), z.number()]).optional(),
      name: z.string(),
      price: z.number().optional(),
      image: z.string().optional().nullable(),
      tag: z.string().optional().nullable(),
    })
    .passthrough(),
});

const cartActivitySchema = z.object({
  productName: z.string().min(1).max(300),
  productId: z.union([z.string(), z.number()]).optional().nullable(),
  catalogKey: z.string().max(160).optional().nullable(),
  productImage: z.string().max(2000).optional().nullable(),
  quantity: z.number().int().positive().max(99).optional(),
});

module.exports = {
  addressBody,
  updateAddressSchema,
  updateProfileSchema,
  placeOrderSchema,
  verifyPaymentSchema,
  cancelOrderSchema,
  returnSchema,
  wishlistSchema,
  cartActivitySchema,
};
