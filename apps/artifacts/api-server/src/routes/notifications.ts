import { Router } from "express";
import { notifications, paginate, filterBy, newId, now } from "../data/mock";

const router = Router();

router.get("/notifications", (req, res) => {
  const { page = "1", limit = "20", channel, status } = req.query as Record<string, string>;
  const filtered = filterBy(notifications, { channel, status });
  res.json(paginate(filtered, Number(page), Number(limit)));
});

router.post("/notifications", (req, res) => {
  const body = req.body;
  const notification = {
    id: newId(),
    channel: body.channel,
    status: "sent",
    recipientId: body.recipientId,
    recipientName: body.recipientId,
    subject: body.subject,
    body: body.body,
    tenantId: body.tenantId ?? null,
    sentAt: now(),
    deliveredAt: null,
    createdAt: now(),
  };
  notifications.unshift(notification as typeof notifications[0]);
  res.status(201).json(notification);
});

router.get("/notifications/stats", (_req, res) => {
  const total = notifications.length;
  const sent = notifications.filter((n) => n.status === "sent").length;
  const delivered = notifications.filter((n) => n.status === "delivered").length;
  const failed = notifications.filter((n) => n.status === "failed").length;
  const pending = notifications.filter((n) => n.status === "pending").length;

  res.json({
    total,
    sent,
    delivered,
    failed,
    pending,
    byChannel: [
      { label: "البريد الإلكتروني", value: notifications.filter((n) => n.channel === "email").length, color: "#3B82F6" },
      { label: "الرسائل القصيرة", value: notifications.filter((n) => n.channel === "sms").length, color: "#10B981" },
      { label: "داخل التطبيق", value: notifications.filter((n) => n.channel === "in_app").length, color: "#F59E0B" },
      { label: "إشعار فوري", value: notifications.filter((n) => n.channel === "push").length, color: "#8B5CF6" },
    ],
  });
});

export default router;
