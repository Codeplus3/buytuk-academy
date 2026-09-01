// =============================================================================
// BuyTuk Academy - Local Strategy
// =============================================================================

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  async validate(username: string, password: string): Promise<any> {
    // TODO: Implement actual validation
    return { id: 1, username };
  }
}
