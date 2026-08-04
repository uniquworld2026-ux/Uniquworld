const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const storePartnerService = require('../services/storePartner.service');
const storePartnerRepository = require('../repositories/storePartner.repository');

const register = asyncHandler(async (req, res) => {
  const data = await storePartnerService.registerPartner(req.body);
  return ApiResponse.created(res, data, data.message);
});

const adminCreate = asyncHandler(async (req, res) => {
  const data = await storePartnerService.adminCreatePartner(req.body, req.user?.id);
  return ApiResponse.created(res, data, 'Store partner created');
});

const adminListStores = asyncHandler(async (req, res) => {
  const items = await storePartnerRepository.listStores({
    limit: Number(req.query.limit) || 100,
    offset: Number(req.query.offset) || 0,
    status: req.query.status || undefined,
  });
  return ApiResponse.ok(res, { items });
});

const adminGetStore = asyncHandler(async (req, res) => {
  const store = await storePartnerRepository.findById(req.params.id);
  if (!store) throw ApiError.notFound('Store not found');
  const [balance, products, sales, monthly] = await Promise.all([
    storePartnerRepository.getBalance(store.id),
    storePartnerRepository.listProductsByStore(store.id),
    storePartnerRepository.listSales(store.id, { limit: 20 }),
    storePartnerRepository.listMonthlyEarnings(store.id),
  ]);
  return ApiResponse.ok(res, { store, balance, products, sales, monthlyEarnings: monthly });
});

const adminListWithdrawals = asyncHandler(async (req, res) => {
  const items = await storePartnerRepository.listAllWithdrawals({
    limit: Number(req.query.limit) || 50,
    offset: Number(req.query.offset) || 0,
    status: req.query.status || undefined,
  });
  return ApiResponse.ok(res, { items });
});

const adminUpdateWithdrawal = asyncHandler(async (req, res) => {
  const item = await storePartnerRepository.updateWithdrawalStatus(req.params.id, {
    status: req.body.status,
    adminNote: req.body.adminNote,
    processedBy: req.user?.id,
  });
  if (!item) throw ApiError.notFound('Withdrawal not found');
  return ApiResponse.ok(res, { item }, 'Withdrawal updated');
});

const dashboard = asyncHandler(async (req, res) => {
  const data = await storePartnerService.getDashboard(req.user.id);
  return ApiResponse.ok(res, data);
});

const listProducts = asyncHandler(async (req, res) => {
  const data = await storePartnerService.listOwnerProducts(req.user.id);
  return ApiResponse.ok(res, data);
});

const createProduct = asyncHandler(async (req, res) => {
  const data = await storePartnerService.createOwnerProduct(req.user.id, req.body);
  return ApiResponse.created(res, data, 'Product created');
});

const updateProduct = asyncHandler(async (req, res) => {
  const data = await storePartnerService.updateOwnerProduct(req.user.id, req.params.id, req.body);
  return ApiResponse.ok(res, data, 'Product updated');
});

const removeProduct = asyncHandler(async (req, res) => {
  const data = await storePartnerService.deleteOwnerProduct(req.user.id, req.params.id);
  return ApiResponse.ok(res, data, 'Product deleted');
});

const patchInventory = asyncHandler(async (req, res) => {
  const stock = req.body.stock;
  if (stock == null) throw ApiError.badRequest('stock is required');
  const data = await storePartnerService.updateInventory(req.user.id, req.params.id, stock);
  return ApiResponse.ok(res, data, 'Inventory updated');
});

const listSales = asyncHandler(async (req, res) => {
  const data = await storePartnerService.listOwnerSales(req.user.id);
  return ApiResponse.ok(res, data);
});

const earnings = asyncHandler(async (req, res) => {
  const data = await storePartnerService.getOwnerEarnings(req.user.id);
  return ApiResponse.ok(res, data);
});

const withdraw = asyncHandler(async (req, res) => {
  const data = await storePartnerService.requestWithdrawal(req.user.id, req.body);
  return ApiResponse.created(res, data, 'Withdrawal requested');
});

const updateProfile = asyncHandler(async (req, res) => {
  const data = await storePartnerService.updateOwnerProfile(req.user.id, req.body);
  return ApiResponse.ok(res, data, 'Store profile updated');
});

module.exports = {
  register,
  adminCreate,
  adminListStores,
  adminGetStore,
  adminListWithdrawals,
  adminUpdateWithdrawal,
  dashboard,
  listProducts,
  createProduct,
  updateProduct,
  removeProduct,
  patchInventory,
  listSales,
  earnings,
  withdraw,
  updateProfile,
};
