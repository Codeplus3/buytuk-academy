import { Router } from "express";
import { assessments, paginate, filterBy, newId, now } from "../data/mock";

const router = Router();

router.get("/assessments", (req, res) => {
  const { page = "1", limit = "20", status, type, tenantId, search } = req.query as Record<string, string>;
  const filtered = filterBy(assessments, { status, type, tenantId, search });
  res.json(paginate(filtered, Number(page), Number(limit)));
});

router.post("/assessments", (req, res) => {
  const body = req.body;
  const assessment = {
    id: newId(),
    title: body.title,
    titleAr: body.titleAr ?? null,
    type: body.type,
    status: "draft",
    tenantId: body.tenantId,
    tenantName: body.tenantId,
    gradeLevel: body.gradeLevel ?? null,
    submissionCount: 0,
    avgScore: null,
    publishedAt: null,
    createdAt: now(),
    updatedAt: now(),
  };
  assessments.unshift(assessment as typeof assessments[0]);
  res.status(201).json(assessment);
});

router.get("/assessments/:id", (req, res) => {
  const a = assessments.find((x) => x.id === req.params.id);
  if (!a) return res.status(404).json({ error: "Assessment not found" });
  res.json(a);
});

router.patch("/assessments/:id", (req, res) => {
  const idx = assessments.findIndex((x) => x.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Assessment not found" });
  Object.assign(assessments[idx], req.body, { updatedAt: now() });
  res.json(assessments[idx]);
});

router.delete("/assessments/:id", (req, res) => {
  const idx = assessments.findIndex((x) => x.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Assessment not found" });
  assessments.splice(idx, 1);
  res.status(204).send();
});

router.post("/assessments/:id/publish", (req, res) => {
  const a = assessments.find((x) => x.id === req.params.id);
  if (!a) return res.status(404).json({ error: "Assessment not found" });
  a.status = "published";
  a.publishedAt = now();
  a.updatedAt = now();
  res.json(a);
});

export default router;
