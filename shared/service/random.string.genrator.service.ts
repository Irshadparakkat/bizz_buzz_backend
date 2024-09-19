import crypto from 'crypto';

export class RandomStringGenerator {
  private characters: string;
  private charactersLength: number;

  constructor() {
    this.characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    this.charactersLength = this.characters.length;
  }

  public generateRandomString(length: number): string {
    let result = '';
    const randomBytes = crypto.randomBytes(length);

    for (let i = 0; i < length; i++) {
      result += this.characters.charAt(randomBytes[i] % this.charactersLength);
    }

    return result;
  }
}
