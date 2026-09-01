// =============================================================================
// BuyTuk Academy - Database Seeder
// =============================================================================

import { db } from "../packages/database/src/drizzle.service.js";
import { users, students, teachers, classes, classStudents } from "../packages/database/src/schema/index.js";
import * as bcrypt from "bcrypt";

async function seed() {
  console.log("🌱 Starting database seeding...");

  try {
    // 1. Create Admin User
    const adminPassword = await bcrypt.hash("admin123", 10);
    const [admin] = await db.insert(users).values({
      username: "admin",
      passwordHash: adminPassword,
      role: "admin",
      email: "admin@buytuk.com",
      isActive: true,
    }).returning();
    console.log(`✅ Created admin user: ${admin.username}`);

    // 2. Create Teacher User
    const teacherPassword = await bcrypt.hash("teacher123", 10);
    const [teacherUser] = await db.insert(users).values({
      username: "teacher",
      passwordHash: teacherPassword,
      role: "teacher",
      email: "teacher@buytuk.com",
      isActive: true,
    }).returning();

    const [teacher] = await db.insert(teachers).values({
      userId: teacherUser.id,
      displayName: "أستاذ محمد",
      specialization: "لغة عربية",
    }).returning();
    console.log(`✅ Created teacher: ${teacher.displayName}`);

    // 3. Create Student User
    const studentPassword = await bcrypt.hash("student123", 10);
    const [studentUser] = await db.insert(users).values({
      username: "student",
      passwordHash: studentPassword,
      role: "student",
      email: "student@buytuk.com",
      isActive: true,
    }).returning();

    const [student] = await db.insert(students).values({
      userId: studentUser.id,
      displayName: "أحمد الطالب",
      grade: "الثالث الابتدائي",
      nativeLanguage: "ar",
    }).returning();
    console.log(`✅ Created student: ${student.displayName}`);

    // 4. Create Class and Enroll Student
    const [classRoom] = await db.insert(classes).values({
      teacherId: teacher.id,
      name: "الفصل الثالث - أ",
      code: "CLS-3A-2026",
      grade: "3",
      academicYear: "2025-2026",
      isActive: true,
    }).returning();

    await db.insert(classStudents).values({
      classId: classRoom.id,
      studentId: student.id,
      status: "active",
    });
    console.log(`✅ Enrolled student in class: ${classRoom.name}`);

    console.log("🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seed();