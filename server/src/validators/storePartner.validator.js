const { z } = require('zod');

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128);

const bankSchema = {
  bankAccountName: z.string().min(1).max(150).optional().nullable(),
  bankAccountNumber: z.string().min(5).max(40).optional().nullable(),
  bankIfsc: z.string().min(4).max(20).optional().nullable(),
  bankName: z.string().max(120).optional().nullable(),
};

const partnerRegisterSchema = z.object({
  email: z.string().email().max(255).transform((v) => v.toLowerCase()),
  password: passwordSchema,
  firstName: z.string().min(1).max(100).trim(),
  lastName: z.string().max(100).trim().optional().nullable(),
  phone: z.string().min(8).max(20).optional().nullable(),
  storeName: z.string().min(2).max(200).trim(),
  storeCode: z.string().max(50).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  state: z.string().max(100).optional().nullable(),
  address: z.string().max(500).optional().nullable(),
  gstin: z.string().max(30).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  ...bankSchema,
});

const adminCreatePartnerSchema = z.object({
  email: z.string().email().max(255).transform((v) => v.toLowerCase()),
  password: passwordSchema.optional(),
  firstName: z.string().min(1).max(100).trim(),
  lastName: z.string().max(100).trim().optional().nullable(),
  phone: z.string().max(20).optional().nullable(),
  storeName: z.string().min(2).max(200).trim(),
  storeCode: z.string().max(50).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  state: z.string().max(100).optional().nullable(),
  address: z.string().max(500).optional().nullable(),
  gstin: z.string().max(30).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  status: z.enum(['active', 'inactive', 'pending_verification', 'pending_approval']).optional(),
  sendInvite: z.boolean().optional().default(true),
  ...bankSchema,
});

const storeProductSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().max(280).optional().nullable(),
  sku: z.string().max(120).optional().nullable(),
  description: z.string().max(5000).optional().nullable(),
  price: z.coerce.number().min(0),
  compareAtPrice: z.coerce.number().min(0).optional().nullable(),
  stock: z.coerce.number().int().min(0).optional().default(0),
  imageUrl: z
    .preprocess(
      (v) => (v === '' || v === undefined ? null : v),
      z.string().url().nullable().optional()
    ),
  gallery: z.array(z.string()).optional(),
  category: z.string().max(120).optional().nullable(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['draft', 'published', 'archived']).optional().default('draft'),
  featured: z.boolean().optional().default(false),
});

const updateStoreProfileSchema = z.object({
  name: z.string().min(2).max(200).optional(),
  city: z.string().max(100).optional().nullable(),
  state: z.string().max(100).optional().nullable(),
  address: z.string().max(500).optional().nullable(),
  phone: z.string().max(20).optional().nullable(),
  gstin: z.string().max(30).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  ...bankSchema,
});

const withdrawSchema = z.object({
  amount: z.coerce.number().positive(),
  note: z.string().max(500).optional().nullable(),
});

const withdrawalStatusSchema = z.object({
  status: z.enum(['pending', 'processing', 'paid', 'rejected']),
  adminNote: z.string().max(500).optional().nullable(),
});

module.exports = {
  partnerRegisterSchema,
  adminCreatePartnerSchema,
  storeProductSchema,
  updateStoreProfileSchema,
  withdrawSchema,
  withdrawalStatusSchema,
};
