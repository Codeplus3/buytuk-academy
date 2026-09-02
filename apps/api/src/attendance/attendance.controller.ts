import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { AttendanceService, type MarkAttendanceInput } from './attendance.service.js';

@Controller('attendance')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  list(@Req() request: { user: { userId: number } }) {
    return this.attendanceService.listForUser(request.user.userId);
  }

  @Post()
  mark(@Req() request: { user: { userId: number } }, @Body() body: MarkAttendanceInput) {
    return this.attendanceService.markForUser(request.user.userId, body);
  }
}
