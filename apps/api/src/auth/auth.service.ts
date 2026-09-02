// =============================================================================
// BuyTuk Academy - Authentication Service
// =============================================================================

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { eq, or } from 'drizzle-orm';
import { getDb, users, type User } from '@buytuk/database';

type AuthenticatedUser = Omit<User, 'passwordHash'>;

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(identifier: string, password: string): Promise<AuthenticatedUser | null> {
    const normalizedIdentifier = identifier.trim();
    if (!normalizedIdentifier || !password) {
      return null;
    }

    const [user] = await getDb()
      .select()
      .from(users)
      .where(or(eq(users.username, normalizedIdentifier), eq(users.email, normalizedIdentifier)));

    if (!user || user.isActive === false || !(await bcrypt.compare(password, user.passwordHash))) {
      return null;
    }

    const { passwordHash: _passwordHash, ...safeUser } = user;
    return safeUser;
  }

  async login(user: AuthenticatedUser) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
