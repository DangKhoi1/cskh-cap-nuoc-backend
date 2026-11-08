export class ProfileError extends Error {
  constructor(
    public readonly code: 'USER_NOT_FOUND',
    message: string,
  ) {
    super(message);
    this.name = 'ProfileError';
  }
}
