import { UnauthorizedException } from '@nestjs/common';
import { admin } from '../firebase/firebase-admin';

export class GoogleAuthService {
  async verifyIdToken(
    idToken: string,
  ): Promise<{ name: string; email: string; loginToken: string }> {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      return {
        name: decodedToken?.name,
        email: decodedToken?.email,
        loginToken: decodedToken?.uid,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
