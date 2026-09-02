import { ForbiddenException } from '@nestjs/common';
import { AttendanceService } from './attendance.service.js';

describe('AttendanceService', () => {
  it('rejects students from marking attendance', async () => {
    const db = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue([{ role: 'student' }]),
    } as never;
    const service = new AttendanceService(db);

    await expect(service.markForUser(7, {
      classId: 1,
      date: '2026-09-02',
      records: [{ studentId: 8, status: 'present' }],
    })).rejects.toBeInstanceOf(ForbiddenException);
  });
});
