import type { BetterAuthOptions } from 'better-auth';
import { emailToPhoneNumber } from '../phone-number.js';

// Only the server may set these fields. Clients cannot mark a phone as verified.
export const authUserConfig = {
  additionalFields: {
    phoneNumber: {
      type: 'string',
      required: false,
      unique: true,
      input: false,
    },
    phoneNumberVerified: {
      type: 'boolean',
      defaultValue: false,
      input: false,
    },
  },
} satisfies BetterAuthOptions['user'];

export async function prepareUserForRegistration(user: { email: string }) {
  return {
    data: {
      ...user,
      phoneNumber: emailToPhoneNumber(user.email),
      phoneNumberVerified: false,
    },
  };
}
