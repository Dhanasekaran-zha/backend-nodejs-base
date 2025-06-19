import Joi from 'joi';

export const refreshTokenCookieSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'any.required': 'Refresh token is required in cookies',
    'string.empty': 'Refresh token in cookie cannot be empty',
  }),
});
