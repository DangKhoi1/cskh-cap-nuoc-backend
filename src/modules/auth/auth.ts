import { betterAuth } from 'better-auth';
import { phoneNumber } from 'better-auth/plugins';
import { loadEnvFile } from 'node:process';
import { Pool } from 'pg';
import { getPostgresConfig } from '../../config/postgres.config.js';
import { otpSender } from './infrastructure/otp-sender.js';

loadEnvFile('.env');

export const authDatabase = new Pool(getPostgresConfig());

export const auth = betterAuth({
  database: authDatabase,
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: { enabled: true, disableSignUp: true },
  disabledPaths: [
    '/sign-in/email',
    '/phone-number/request-password-reset',
    '/phone-number/reset-password',
  ],
  session: {
    cookieCache: { enabled: false },
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  plugins: [
    phoneNumber({
      otpLength: 6,
      expiresIn: 300,
      allowedAttempts: 5,
      phoneNumberValidator: (value) => /^\+[1-9]\d{7,14}$/.test(value),
      requireVerification: false,
      sendOTP: (data) => otpSender.send(data),
      signUpOnVerification: {
        // Tên nội bộ; tên chủ hợp đồng được lấy riêng từ khách hàng v2.
        getTempName: (phone) => phone,
        getTempEmail: (phone) => `${phone.slice(1)}@phone.invalid`,
      },
    }),
  ],
});
