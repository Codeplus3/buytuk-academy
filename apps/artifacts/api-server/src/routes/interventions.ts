import { Router } from "express";
import { interventions, referrals, paginate, filterBy, newId, now } from "../data/mock";

const router = Router();

router.get("/interventions", (req, res) => {
  const { page = "1", limit = "20", status, tenantId, studentId } = req.query as Record<string, string>;
  const filtered = filterBy(interventions, { status, tenantId, studentId });
  res.json(paginate(filtered, Number(page), Number(limit)));
});

router.post("/interventions", (req, res) => {
  const body = req.body;
  const intervention = {
    id: newId(),
    studentId: body.studentId,
    studentName: body.studentId,
    type: body.type,
    status: "active",
    tenantId: body.tenantId,
    tenantName: body.tenantId,
    assignedTeacherId: body.assignedTeacherId ?? null,
    assignedTeacherName: null,
    iipStatus: "not_started",
    startedAt: now(),
    completedAt: null,
    createdAt: now(),
    updatedAt: now(),
  };
  interventions.unshift(intervention as typeof interventions[0]);
  res.status(201).json(intervention);
});

router.get("/interventions/:id", (req, res) => {
  const item = interventions.find((i) => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: "Intervention not found" });
  res.json(item);
});

router.patch("/interventions/:id", (req, res) => {
  const idx = interventions.findIndex((i) => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Intervention not found" });
  Object.assign(interventions[idx], req.body, { updatedAt: now() });
  res.json(interventions[idx]);
});

router.get("/referrals", (req, res) => {
  const { page = "1", limit = "20", status } = req.query as Record<string, string>;
  const filtered = filterBy(referrals, { status });
  res.json(paginate(filtered, Number(page), Number(limit)));
});

router.post("/referrals", (req, res) => {
  const body = req.body;
  const referral = {
    id: newId(),
    studentId: body.studentId,
    studentName: body.studentId,
    referredBy: body.referredBy,
    referredByName: body.referredBy,
    status: "pending",
    reason: body.reason,
    createdAt: now(),
  };
  referrals.unshift(referral as typeof referrals[0]);
  res.status(201).json(referral);
});

export default router;
