import Joi from 'joi';

const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const loginSchema = Joi.object({
  email: Joi.string().pattern(emailPattern).required().messages({
    'string.pattern.base': 'Email must be a valid email address',
    'string.empty': 'Email is required',
  }),
  password: Joi.string().pattern(passwordPattern).required().messages({
    'string.pattern.base':
      'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character',
    'string.empty': 'Password is required',
  }),
});
