import dotenv from 'dotenv';
dotenv.config();

const requiredKeys = ['PORT', 'MONGO_URI', 'JWT_SECRET', 'JWT_EXPIRES_IN', 'CLIENT_URL'];

for (const key of requiredKeys) {
  if (!process.env[key]) {
    throw new Error(`Missing env var: ${key}`);
  }
}

const env = Object.freeze({
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  CLIENT_URL: process.env.CLIENT_URL,
  NODE_ENV: process.env.NODE_ENV || 'development',
});

export default env;
