import { Router } from "express";
import { submissions, paginate, filterBy } from "../data/mock";

const router = Router();

router.get("/submissions", (req, res) => {
  const { page = "1", limit = "20", assessmentId, studentId, status } = req.query as Record<string, string>;
  const filtered = filterBy(submissions, { assessmentId, studentId, status });
  res.json(paginate(filtered, Number(page), Number(limit)));
});

router.get("/submissions/:id", (req, res) => {
  const sub = submissions.find((s) => s.id === req.params.id);
  if (!sub) return res.status(404).json({ error: "Submission not found" });
  res.json(sub);
});

export default router;
