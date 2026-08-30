import { Router } from "express";
import { tenants, paginate, filterBy, newId, now } from "../data/mock";

const router = Router();

router.get("/tenants", (req, res) => {
  const { page = "1", limit = "20", status, search } = req.query as Record<string, string>;
  const filtered = filterBy(tenants, { status, search });
  res.json(paginate(filtered, Number(page), Number(limit)));
});

router.post("/tenants", (req, res) => {
  const body = req.body;
  const tenant = {
    id: newId(),
    nameEn: body.nameEn,
    nameAr: body.nameAr,
    status: "trial",
    type: body.type,
    contactEmail: body.contactEmail ?? null,
    contactPhone: body.contactPhone ?? null,
    schoolCount: 0,
    userCount: 0,
    studentCount: 0,
    subscriptionPlan: body.subscriptionPlan ?? "starter",
    subscriptionExpiresAt: null,
    createdAt: now(),
    updatedAt: now(),
  };
  tenants.unshift(tenant as typeof tenants[0]);
  res.status(201).json(tenant);
});

router.get("/tenants/:id", (req, res) => {
  const tenant = tenants.find((t) => t.id === req.params.id);
  if (!tenant) return res.status(404).json({ error: "Tenant not found" });
  res.json(tenant);
});

router.patch("/tenants/:id", (req, res) => {
  const idx = tenants.findIndex((t) => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Tenant not found" });
  Object.assign(tenants[idx], req.body, { updatedAt: now() });
  res.json(tenants[idx]);
});

router.delete("/tenants/:id", (req, res) => {
  const idx = tenants.findIndex((t) => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Tenant not found" });
  tenants.splice(idx, 1);
  res.status(204).send();
});

router.post("/tenants/:id/suspend", (req, res) => {
  const tenant = tenants.find((t) => t.id === req.params.id);
  if (!tenant) return res.status(404).json({ error: "Tenant not found" });
  tenant.status = "suspended";
  tenant.updatedAt = now();
  res.json(tenant);
});

router.post("/tenants/:id/activate", (req, res) => {
  const tenant = tenants.find((t) => t.id === req.params.id);
  if (!tenant) return res.status(404).json({ error: "Tenant not found" });
  tenant.status = "active";
  tenant.updatedAt = now();
  res.json(tenant);
});

export default router;
