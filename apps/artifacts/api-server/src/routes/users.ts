import { Router } from "express";
import { users, paginate, filterBy, newId, now } from "../data/mock";

const router = Router();

router.get("/users", (req, res) => {
  const { page = "1", limit = "20", role, tenantId, schoolId, status, search } = req.query as Record<string, string>;
  const filtered = filterBy(users, { role, tenantId, schoolId, status, search });
  res.json(paginate(filtered, Number(page), Number(limit)));
});

router.post("/users", (req, res) => {
  const body = req.body;
  const user = {
    id: newId(),
    nameEn: body.nameEn,
    nameAr: body.nameAr,
    email: body.email,
    role: body.role,
    status: "active",
    tenantId: body.tenantId,
    tenantName: body.tenantId,
    schoolId: body.schoolId ?? null,
    schoolName: null,
    phone: body.phone ?? null,
    avatarUrl: null,
    lastLoginAt: null,
    createdAt: now(),
    updatedAt: now(),
  };
  users.unshift(user as typeof users[0]);
  res.status(201).json(user);
});

router.get("/users/:id", (req, res) => {
  const user = users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

router.patch("/users/:id", (req, res) => {
  const idx = users.findIndex((u) => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "User not found" });
  Object.assign(users[idx], req.body, { updatedAt: now() });
  res.json(users[idx]);
});

router.delete("/users/:id", (req, res) => {
  const idx = users.findIndex((u) => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "User not found" });
  users.splice(idx, 1);
  res.status(204).send();
});

router.post("/users/:id/suspend", (req, res) => {
  const user = users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  (user as Record<string, unknown>).status = "suspended";
  (user as Record<string, unknown>).updatedAt = now();
  res.json(user);
});

router.post("/users/:id/activate", (req, res) => {
  const user = users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  (user as Record<string, unknown>).status = "active";
  (user as Record<string, unknown>).updatedAt = now();
  res.json(user);
});

export default router;
