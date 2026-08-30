import { Router } from "express";
import { roles, policies, filterBy, newId, now } from "../data/mock";

const router = Router();

router.get("/roles", (req, res) => {
  const { tenantId } = req.query as Record<string, string>;
  const filtered = filterBy(roles, { tenantId });
  res.json(filtered);
});

router.post("/roles", (req, res) => {
  const body = req.body;
  const role = {
    id: newId(),
    name: body.name,
    description: body.description ?? null,
    tenantId: body.tenantId,
    permissions: body.permissions ?? [],
    userCount: 0,
    createdAt: now(),
  };
  roles.unshift(role as typeof roles[0]);
  res.status(201).json(role);
});

router.get("/roles/:id", (req, res) => {
  const role = roles.find((r) => r.id === req.params.id);
  if (!role) return res.status(404).json({ error: "Role not found" });
  res.json(role);
});

router.patch("/roles/:id", (req, res) => {
  const idx = roles.findIndex((r) => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Role not found" });
  Object.assign(roles[idx], req.body);
  res.json(roles[idx]);
});

router.delete("/roles/:id", (req, res) => {
  const idx = roles.findIndex((r) => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Role not found" });
  roles.splice(idx, 1);
  res.status(204).send();
});

router.get("/policies", (req, res) => {
  const { tenantId } = req.query as Record<string, string>;
  const filtered = filterBy(policies, { tenantId });
  res.json(filtered);
});

router.post("/policies", (req, res) => {
  const body = req.body;
  const policy = {
    id: newId(),
    name: body.name,
    tenantId: body.tenantId,
    effect: body.effect,
    resource: body.resource,
    actions: body.actions ?? [],
    createdAt: now(),
  };
  policies.unshift(policy as typeof policies[0]);
  res.status(201).json(policy);
});

export default router;
