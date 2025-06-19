import responseHandler from '../utils/responseHandlers.js';

export const createValidator = (schema, options = {}) => {
  const { source = 'body', errorMessage } = options;

  return (req, res, next) => {
    try {
      let data;
      switch (source) {
        case 'cookies':
          data = req.cookies;
          break;
        case 'query':
          data = req.query;
          break;
        default:
          data = req.body;
      }

      const { error } = schema.validate(data, { abortEarly: false });

      if (error) {
        const defaultMessages = {
          body: 'Invalid request data',
          cookies: 'Invalid cookie data',
          query: 'Invalid query parameters',
        };
        const errorDetails = {
          code: 'ValidationError',
          details: error.details.map((detail) => ({
            field: detail.path.join('.'),
            message: detail.message,
          })),
        };
        return responseHandler.badRequest(
          res,
          errorDetails,
          errorMessage || defaultMessages[source] || `Invalid ${source} data`
        );
      }

      next();
    } catch (e) {
      return responseHandler.internalError(
        res,
        {
          code: 'ServerError',
          error: e.message || e,
        },
        'Internal Server Error'
      );
    }
  };
};

// Specific validators using the factory function
export const validate = (schema) => createValidator(schema, { source: 'body' });
export const validateCookies = (schema) =>
  createValidator(schema, { source: 'cookies' });
export const validateQuery = (schema) =>
  createValidator(schema, { source: 'query' });
