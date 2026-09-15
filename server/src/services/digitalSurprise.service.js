const crypto = require('crypto');
const path = require('path');
const config = require('../config');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');
const digitalSurpriseRepository = require('../repositories/digitalSurprise.repository');
const razorpayService = require('./razorpay.service');
const emailService = require('./email.service');
const templates = require('../templates/email.templates');
const { uploadFile } = require('../config/supabase');
const {
  OCCASIONS,
  PRICE_PAISE,
  isValidOccasion,
  isValidTemplate,
} = require('../constants/digitalSurprise');

const toPublic = (row, { includeBuyer = false } = {}) => {
  if (!row) return null;
  const base = {
    id: row.id,
    slug: row.slug,
    occasion: row.occasion,
    templateId: row.template_id,
    recipientName: row.recipient_name,
    senderName: row.sender_name,
    message: row.message,
    media: row.media || {},
    amountPaise: row.amount_paise,
    currency: row.currency,
    status: row.status,
    sharePath: row.share_path,
    shareUrl: `${config.clientUrl.replace(/\/$/, '')}${row.share_path}`,
    expiresAt: row.expires_at,
    paidAt: row.paid_at,
    previewCount: row.preview_count,
    createdAt: row.created_at,
  };
  if (includeBuyer) {
    base.buyerEmail = row.buyer_email;
    base.buyerPhone = row.buyer_phone;
  }
  return base;
};

const listOccasions = () =>
  Object.values(OCCASIONS).map((o) => ({
    id: o.id,
    slug: o.slug,
    title: o.title,
    dateLabel: o.dateLabel,
    headline: o.headline,
    priceInr: o.priceInr,
    kind: o.kind || 'surprise',
    templateIds: o.templates,
    customizePath:
      o.kind === 'invitation'
        ? `/surprise/invitation/${o.slug}`
        : `/surprise/digital/${o.slug}`,
  }));

const createDraft = async (payload, user = null) => {
  const occasion = payload.occasion;
  if (!isValidOccasion(occasion)) {
    throw ApiError.badRequest('Invalid occasion');
  }
  if (!isValidTemplate(occasion, payload.templateId)) {
    throw ApiError.badRequest('Invalid template for this occasion');
  }

  const recipientName = String(payload.recipientName || '').trim();
  if (recipientName.length < 2) {
    throw ApiError.badRequest('Enter their name (at least 2 characters)');
  }

  const buyerEmail = String(payload.buyerEmail || user?.email || '')
    .trim()
    .toLowerCase();
  if (!buyerEmail || !buyerEmail.includes('@')) {
    throw ApiError.badRequest('A valid email is required to send your surprise link');
  }

  let slug = digitalSurpriseRepository.generateSlug();
  // rare collision retry
  for (let i = 0; i < 3; i += 1) {
    const existing = await digitalSurpriseRepository.findBySlug(slug);
    if (!existing) break;
    slug = digitalSurpriseRepository.generateSlug();
  }

  const sharePath = `/surprise/s/${slug}`;
  const row = await digitalSurpriseRepository.create({
    slug,
    occasion,
    templateId: payload.templateId,
    recipientName,
    senderName: payload.senderName?.trim() || null,
    message: payload.message?.trim() || null,
    media: {
      instagramUrl: payload.instagramUrl?.trim() || null,
      videoUrl: payload.videoUrl?.trim() || null,
      photoUrl: payload.photoUrl?.trim() || null,
      musicUrl: payload.musicUrl?.trim() || null,
      eventDate: payload.eventDate?.trim() || null,
      eventTime: payload.eventTime?.trim() || null,
      venue: payload.venue?.trim() || null,
      rsvpContact: payload.rsvpContact?.trim() || null,
    },
    buyerEmail,
    buyerPhone: payload.buyerPhone?.trim() || null,
    userId: user?.id || null,
    amountPaise: PRICE_PAISE,
    currency: 'INR',
    sharePath,
  });

  return toPublic(row, { includeBuyer: true });
};

const startCheckout = async (id) => {
  const row = await digitalSurpriseRepository.findById(id);
  if (!row) throw ApiError.notFound('Surprise not found');
  if (row.status === 'active') {
    return {
      alreadyPaid: true,
      surprise: toPublic(row, { includeBuyer: true }),
    };
  }
  if (row.status !== 'pending_payment') {
    throw ApiError.badRequest('This surprise cannot be paid for');
  }

  if (!razorpayService.isConfigured()) {
    if (config.env === 'production') {
      throw ApiError.badRequest('Payments are temporarily unavailable');
    }
    // Dev without Razorpay: return mock checkout flag
    return {
      mockPay: true,
      keyId: null,
      razorpayOrderId: `dev_${row.id.slice(0, 8)}`,
      amount: row.amount_paise,
      currency: row.currency,
      surprise: toPublic(row, { includeBuyer: true }),
      name: config.razorpay?.displayName || 'Uniquworld',
    };
  }

  const rzpOrder = await razorpayService.createOrder({
    amountPaise: row.amount_paise,
    receipt: `ds_${row.slug}`.slice(0, 40),
    notes: {
      type: 'digital_surprise',
      slug: row.slug,
      occasion: row.occasion,
      recipient: row.recipient_name,
    },
  });

  await digitalSurpriseRepository.setRazorpayOrder(row.id, rzpOrder.id);

  return {
    keyId: razorpayService.getPublicKey(),
    razorpayOrderId: rzpOrder.id,
    amount: row.amount_paise,
    currency: row.currency,
    surprise: toPublic(row, { includeBuyer: true }),
    name: config.razorpay.displayName || 'Uniquworld',
    description: `Digital Surprise — ${OCCASIONS[row.occasion]?.title || 'Uniquworld'}`,
    prefill: {
      email: row.buyer_email,
      contact: row.buyer_phone || undefined,
      name: row.sender_name || undefined,
    },
  };
};

const sendLinkEmail = async (row) => {
  const shareUrl = `${config.clientUrl.replace(/\/$/, '')}${row.share_path}`;
  const occasion = OCCASIONS[row.occasion];
  try {
    const { subject, html, text } = templates.digitalSurpriseEmail({
      buyerName: row.sender_name,
      recipientName: row.recipient_name,
      occasionTitle: occasion?.title || 'Digital Surprise',
      shareUrl,
      expiresAt: row.expires_at,
    });
    await emailService.sendMail({
      to: row.buyer_email,
      subject,
      html,
      text,
    });
  } catch (err) {
    logger.error('Digital surprise email failed', {
      slug: row.slug,
      message: err.message,
    });
  }
};

const verifyAndActivate = async (id, payment) => {
  const row = await digitalSurpriseRepository.findById(id);
  if (!row) throw ApiError.notFound('Surprise not found');
  if (row.status === 'active') {
    return toPublic(row, { includeBuyer: true });
  }

  const isMock =
    payment?.mock === true ||
    String(payment?.razorpayOrderId || '').startsWith('dev_');

  if (isMock) {
    if (config.env === 'production') {
      throw ApiError.badRequest('Invalid payment');
    }
  } else {
    const ok = razorpayService.verifyPaymentSignature({
      razorpayOrderId: payment.razorpayOrderId,
      razorpayPaymentId: payment.razorpayPaymentId,
      razorpaySignature: payment.razorpaySignature,
    });
    if (!ok) throw ApiError.badRequest('Payment verification failed');
    if (row.razorpay_order_id && row.razorpay_order_id !== payment.razorpayOrderId) {
      throw ApiError.badRequest('Payment order mismatch');
    }
  }

  const activated = await digitalSurpriseRepository.activatePaid(row.id, {
    razorpayPaymentId: payment.razorpayPaymentId || (isMock ? 'dev_mock' : null),
    expiresAt: null,
  });

  await sendLinkEmail(activated);
  return toPublic(activated, { includeBuyer: true });
};

const getPublicBySlug = async (slug) => {
  const row = await digitalSurpriseRepository.findBySlug(slug);
  if (!row) throw ApiError.notFound('Surprise not found');

  if (row.status === 'pending_payment') {
    throw ApiError.forbidden('This surprise is not published yet');
  }

  if (row.status === 'cancelled') {
    throw ApiError.notFound('Surprise not found');
  }

  // Lifetime links — serve even if an older 30-day window already marked them expired.
  if (row.status === 'expired') {
    const revived = await digitalSurpriseRepository.reviveLifetime(row.id);
    return toPublic(revived || row);
  }

  return toPublic(row);
};

const recordPreview = async (id) => {
  const row = await digitalSurpriseRepository.findById(id);
  if (!row) throw ApiError.notFound('Surprise not found');
  const updated = await digitalSurpriseRepository.incrementPreview(id);
  return {
    previewCount: updated.preview_count,
    // Server allows unlimited counts; client enforces “once” UX for demo
    allowed: true,
  };
};

const AUDIO_EXT = new Set(['mp3', 'wav', 'ogg', 'm4a', 'aac', 'webm']);
const EXT_MIME = {
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  ogg: 'audio/ogg',
  m4a: 'audio/mp4',
  aac: 'audio/aac',
  webm: 'audio/webm',
};

const uploadMusic = async (file) => {
  if (!file?.buffer) {
    throw ApiError.badRequest('Choose a song file to upload');
  }

  const ext = path
    .extname(file.originalname || '')
    .replace('.', '')
    .toLowerCase();
  const safeExt = AUDIO_EXT.has(ext) ? ext : 'mp3';
  const fileName = `${crypto.randomBytes(16).toString('hex')}.${safeExt}`;
  const storagePath = `digital-surprise/music/${fileName}`;
  const contentType = file.mimetype || EXT_MIME[safeExt] || 'audio/mpeg';

  try {
    const { publicUrl } = await uploadFile(storagePath, file.buffer, contentType);
    return { url: publicUrl };
  } catch (err) {
    logger.error('Music upload failed', { message: err.message });
    throw ApiError.badRequest('Could not upload song. Try a YouTube link instead.');
  }
};

module.exports = {
  listOccasions,
  createDraft,
  startCheckout,
  verifyAndActivate,
  getPublicBySlug,
  recordPreview,
  uploadMusic,
  PRICE_PAISE,
};
