class ApiResponse {
  /**
   * @param {import('express').Response} res
   * @param {number} statusCode
   * @param {unknown} data
   * @param {string} message
   */
  static success(res, statusCode, data = null, message = 'Success') {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static created(res, data = null, message = 'Created') {
    return ApiResponse.success(res, 201, data, message);
  }

  static ok(res, data = null, message = 'Success') {
    return ApiResponse.success(res, 200, data, message);
  }

  static noContent(res) {
    return res.status(204).send();
  }
}

module.exports = ApiResponse;
