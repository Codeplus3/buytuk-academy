import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service.js';
import { getDb } from '@buytuk/database';

jest.mock('@buytuk/database', () => ({
  getDb: jest.fn(),
}));

describe('AuthService', () => {
  it('validates a real user with username/email and password', async () => {
    const passwordHash = await bcrypt.hash('admin123', 10);

    const fakeDb = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue([
        {
          id: 42,
          username: 'admin',
          email: 'admin@buytuk.com',
          passwordHash,
          role: 'admin',
          isActive: true,
        },
      ]),
    };

    (getDb as jest.Mock).mockReturnValue(fakeDb);

    const service = new AuthService(
      new JwtService({
        secret: 'test-secret',
        signOptions: { expiresIn: '1h' },
      })
    );

    const user = await service.validateUser('admin', 'admin123');

    expect(user).toMatchObject({
      id: 42,
      username: 'admin',
      email: 'admin@buytuk.com',
      role: 'admin',
    });
  });
});
