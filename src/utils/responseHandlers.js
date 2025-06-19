const responseHandler = {
  ok: (res, data = {}, message = 'OK') => {
    return res.status(200).json({
      code: 200,
      status: 'success',
      message,
      data,
    });
  },

  created: (res, data = {}, message = 'Resource created') => {
    return res.status(201).json({
      code: 201,
      status: 'success',
      message,
      data,
    });
  },

  badRequest: (res, error = {}, message = 'Bad Request') => {
    return res.status(400).json({
      code: 400,
      status: 'error',
      message,
      error,
    });
  },

  unauthorized: (res, error = {}, message = 'Unauthorized') => {
    return res.status(401).json({
      code: 401,
      status: 'error',
      message,
      error,
    });
  },

  forbidden: (res, error = {}, message = 'Forbidden') => {
    return res.status(403).json({
      code: 403,
      status: 'error',
      message,
      error,
    });
  },

  notFound: (res, error = {}, message = 'Not Found') => {
    return res.status(404).json({
      code: 404,
      status: 'error',
      message,
      error,
    });
  },

  conflict: (res, error = {}, message = 'Conflict') => {
    return res.status(409).json({
      code: 409,
      status: 'error',
      message,
      error,
    });
  },

  internalError: (res, error = {}, message = 'Internal Server Error') => {
    return res.status(500).json({
      code: 500,
      status: 'error',
      message,
      error,
    });
  },
};

export default responseHandler;
