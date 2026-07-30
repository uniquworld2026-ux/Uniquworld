const { z } = require('zod');

const createDigitalSurpriseSchema = z.object({
  occasion: z.enum(['girlfriends_day', 'birthday', 'diwali']),
  templateId: z.string().min(2).max(40),
  recipientName: z.string().min(2).max(120),
  senderName: z.string().max(120).optional().nullable(),
  message: z.string().max(2000).optional().nullable(),
  buyerEmail: z.string().email().max(255),
  buyerPhone: z.string().max(30).optional().nullable(),
  instagramUrl: z.string().url().max(500).optional().nullable().or(z.literal('')),
  videoUrl: z.string().url().max(500).optional().nullable().or(z.literal('')),
  photoUrl: z.string().url().max(500).optional().nullable().or(z.literal('')),
});

const verifyDigitalPaymentSchema = z.object({
  razorpayOrderId: z.string().min(3).max(80).optional(),
  razorpayPaymentId: z.string().min(3).max(80).optional(),
  razorpaySignature: z.string().min(3).max(200).optional(),
  mock: z.boolean().optional(),
});

module.exports = {
  createDigitalSurpriseSchema,
  verifyDigitalPaymentSchema,
};
