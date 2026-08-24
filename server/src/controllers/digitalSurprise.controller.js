const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const digitalSurpriseService = require('../services/digitalSurprise.service');

const listOccasions = asyncHandler(async (_req, res) => {
  const data = digitalSurpriseService.listOccasions();
  return ApiResponse.ok(res, { occasions: data }, 'Digital surprise occasions');
});

const create = asyncHandler(async (req, res) => {
  const data = await digitalSurpriseService.createDraft(req.body, req.user || null);
  return ApiResponse.created(res, data, 'Draft created — complete ₹39 payment to publish');
});

const checkout = asyncHandler(async (req, res) => {
  const data = await digitalSurpriseService.startCheckout(req.params.id);
  return ApiResponse.ok(res, data, 'Checkout ready');
});

const verifyPayment = asyncHandler(async (req, res) => {
  const data = await digitalSurpriseService.verifyAndActivate(req.params.id, req.body);
  return ApiResponse.ok(res, data, 'Surprise published — link emailed');
});

const getBySlug = asyncHandler(async (req, res) => {
  const data = await digitalSurpriseService.getPublicBySlug(req.params.slug);
  return ApiResponse.ok(res, data, 'Surprise loaded');
});

const preview = asyncHandler(async (req, res) => {
  const data = await digitalSurpriseService.recordPreview(req.params.id);
  return ApiResponse.ok(res, data, 'Preview recorded');
});

const uploadMusic = asyncHandler(async (req, res) => {
  const data = await digitalSurpriseService.uploadMusic(req.file);
  return ApiResponse.ok(res, data, 'Song uploaded');
});

module.exports = {
  listOccasions,
  create,
  checkout,
  verifyPayment,
  getBySlug,
  preview,
  uploadMusic,
};
