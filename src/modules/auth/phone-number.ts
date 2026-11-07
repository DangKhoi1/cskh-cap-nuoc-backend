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
