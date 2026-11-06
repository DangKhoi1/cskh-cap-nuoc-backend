export function normalizePhoneNumber(value: unknown): unknown {
  if (typeof value !== 'string') {
    return value;
  }

  const phoneNumber = value.trim().replace(/[\s().-]/g, '');

  if (/^0\d{9}$/.test(phoneNumber)) {
    return '+84' + phoneNumber.slice(1);
  }

  return phoneNumber;
}

export function phoneNumberToEmail(phoneNumber: string): string {
  return `${phoneNumber.slice(1)}@phone.invalid`;
}

export function emailToPhoneNumber(email: string): string | null {
  const match = email.match(/^([1-9]\d{7,14})@phone\.invalid$/);

  if (!match) {
    return null;
  }

  return '+' + match[1];
}
