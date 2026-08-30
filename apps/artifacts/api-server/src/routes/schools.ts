import { Router } from "express";
import { schools, paginate, filterBy, newId, now } from "../data/mock";

const router = Router();

router.get("/schools", (req, res) => {
  const { page = "1", limit = "20", tenantId, status, search } = req.query as Record<string, string>;
  const filtered = filterBy(schools, { tenantId, status, search });
  res.json(paginate(filtered, Number(page), Number(limit)));
});

router.post("/schools", (req, res) => {
  const body = req.body;
  const school = {
    id: newId(),
    nameEn: body.nameEn,
    nameAr: body.nameAr,
    tenantId: body.tenantId,
    tenantName: body.tenantId,
    status: "active",
    city: body.city ?? null,
    region: body.region ?? null,
    principalName: body.principalName ?? null,
    teacherCount: 0,
    studentCount: 0,
    phone: body.phone ?? null,
    createdAt: now(),
    updatedAt: now(),
  };
  schools.unshift(school as typeof schools[0]);
  res.status(201).json(school);
});

router.get("/schools/:id", (req, res) => {
  const school = schools.find((s) => s.id === req.params.id);
  if (!school) return res.status(404).json({ error: "School not found" });
  res.json(school);
});

router.patch("/schools/:id", (req, res) => {
  const idx = schools.findIndex((s) => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "School not found" });
  Object.assign(schools[idx], req.body, { updatedAt: now() });
  res.json(schools[idx]);
});

router.delete("/schools/:id", (req, res) => {
  const idx = schools.findIndex((s) => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "School not found" });
  schools.splice(idx, 1);
  res.status(204).send();
});

export default router;
