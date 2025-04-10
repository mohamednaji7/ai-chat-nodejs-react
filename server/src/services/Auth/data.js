import dotenv from 'dotenv';
dotenv.config();

export const ADMIN_EMAILS = [
  process.env.EMAIL_DEV,
  process.env.EMAIL_OWNER,
  process.env.EMAIL_BZNS,
  ]; 

export const isAdmin = (email) => {
  return ADMIN_EMAILS.includes(email);
}