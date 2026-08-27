import { Router } from "express";
import { evidence, paginate, filterBy, now } from "../data/mock";

const router = Router();

router.get("/evidence", (req, res) => {
  const { page = "1", limit = "20", studentId, tenantId, requiresHumanReview, type } = req.query as Record<string, string>;
  let filtered = filterBy(evidence, { studentId, tenantId, type });
  if (requiresHumanReview !== undefined) {
    const flag = requiresHumanReview === "true";
    filtered = filtered.filter((e) => e.requiresHumanReview === flag);
  }
  res.json(paginate(filtered, Number(page), Number(limit)));
});

router.get("/evidence/:id", (req, res) => {
  const item = evidence.find((e) => e.id === req.params.id);
  if (!item) return res.status(404).json({ error: "Evidence not found" });
  res.json(item);
});

router.post("/evidence/:id/review", (req, res) => {
  const item = evidence.find((e) => e.id === req.params.id);
  if (!item) return res.status(404).json({ error: "Evidence not found" });
  item.reviewedBy = req.body.reviewedBy;
  item.reviewedAt = now();
  res.json(item);
});

export default router;
