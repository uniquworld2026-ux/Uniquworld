const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const authService = require('../services/auth.service');

const getRequestMeta = (req) => ({
  userAgent: req.headers['user-agent'],
  ipAddress: req.ip,
});

const register = asyncHandler(async (req, res) => {
  const data = await authService.register(req.body);
  return ApiResponse.created(res, data, 'Registration successful. Please verify your email.');
});

const login = asyncHandler(async (req, res) => {
  const data = await authService.login(req.body, getRequestMeta(req));
  return ApiResponse.ok(res, data, 'Login successful');
});

const logout = asyncHandler(async (req, res) => {
  const data = await authService.logout(req.body.refreshToken);
  return ApiResponse.ok(res, data, 'Logged out successfully');
});

const refresh = asyncHandler(async (req, res) => {
  const data = await authService.refresh(req.body.refreshToken, getRequestMeta(req));
  return ApiResponse.ok(res, data, 'Token refreshed');
});

const forgotPassword = asyncHandler(async (req, res) => {
  const data = await authService.forgotPassword(req.body.email);
  return ApiResponse.ok(res, data, data.message);
});

const resetPassword = asyncHandler(async (req, res) => {
  const data = await authService.resetPassword(req.body);
  return ApiResponse.ok(res, data, data.message);
});

const verifyOtp = asyncHandler(async (req, res) => {
  const data = await authService.verifyOtp(req.body);
  return ApiResponse.ok(res, data, 'OTP verified successfully');
});

const resendOtp = asyncHandler(async (req, res) => {
  const data = await authService.resendOtp(req.body);
  return ApiResponse.ok(res, data, data.message || 'OTP sent');
});

const googleLogin = asyncHandler(async (req, res) => {
  const data = await authService.googleLogin(req.body, getRequestMeta(req));
  return ApiResponse.ok(res, data, 'Google login successful');
});

const me = asyncHandler(async (req, res) => {
  const data = await authService.me(req.user.id);
  return ApiResponse.ok(res, data, 'Profile fetched');
});

module.exports = {
  register,
  login,
  logout,
  refresh,
  forgotPassword,
  resetPassword,
  verifyOtp,
  resendOtp,
  googleLogin,
  me,
};
