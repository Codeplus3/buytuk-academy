import { Router } from "express";
import { systemSettings } from "../data/mock";

const router = Router();

router.get("/settings", (_req, res) => {
  res.json(systemSettings);
});

router.patch("/settings", (req, res) => {
  Object.assign(systemSettings, req.body);
  res.json(systemSettings);
});

export default router;
