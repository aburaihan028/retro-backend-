export const globalErrorHandler = (error, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    developmentError(error, res);
  } else {
    productionError(error, res);
  }
};

const developmentError = (error, res) => {
  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json({
    message: error.message,
    status: error.status,
    statusCode: error.statusCode,
    isOperationalError: error.isOperationalError,
    data: error.data,
    errorTraceStack: error.stack,
  });
};

const productionError = (error, res) => {
  const statusCode = error.statusCode || 500;

  if (error.isOperationalError) {
    return res.status(statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    return res.status(500).json({
      message: "Something went very wrong! Please try again later",
    });
  }
};
