// src/utils/asyncHandler.js

const asyncHandler = (fn) => async (req, res, next) => {
  try {
    return await fn(req, res, next);
  } catch (error) {
    if (res && typeof res.status === "function") {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
        errors: error.errors || [],
      });
    }
    throw error;
  }
};

export { asyncHandler };
