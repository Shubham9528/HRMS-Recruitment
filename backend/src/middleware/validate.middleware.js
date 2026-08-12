import { asyncHandler } from '../utils/asyncHandler.js';

export const validate = (schema) => {
  return asyncHandler(async (req, res, next) => {
    try {
      // parseAsync handles async transformations if any, and strips unknown keys by default if schema is strict,
      // but standard object schema just passes through what is defined.
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      // Zod throws an error object that contains an 'errors' array
      const firstErrorMessage = error.errors ? error.errors[0].message : 'Validation failed';
      const err = new Error(firstErrorMessage);
      err.statusCode = 400;
      throw err;
    }
  });
};
