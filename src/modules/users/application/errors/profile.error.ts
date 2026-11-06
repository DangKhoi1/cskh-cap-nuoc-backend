export class ProfileError extends Error {
  constructor(
    public readonly code: 'USER_NOT_FOUND' | 'INVALID_USER_NAME',
    message: string,
  ) {
    super(message);
    this.name = 'ProfileError';
  }
}
