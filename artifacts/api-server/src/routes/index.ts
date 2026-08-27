import { Router, type IRouter } from "express";
import healthRouter from "./health";
import dashboardRouter from "./dashboard";
import tenantsRouter from "./tenants";
import schoolsRouter from "./schools";
import usersRouter from "./users";
import rolesRouter from "./roles";
import assessmentsRouter from "./assessments";
import submissionsRouter from "./submissions";
import interventionsRouter from "./interventions";
import evidenceRouter from "./evidence";
import notificationsRouter from "./notifications";
import reportsRouter from "./reports";
import settingsRouter from "./settings";

const router: IRouter = Router();

router.use(healthRouter);
router.use(dashboardRouter);
router.use(tenantsRouter);
router.use(schoolsRouter);
router.use(usersRouter);
router.use(rolesRouter);
router.use(assessmentsRouter);
router.use(submissionsRouter);
router.use(interventionsRouter);
router.use(evidenceRouter);
router.use(notificationsRouter);
router.use(reportsRouter);
router.use(settingsRouter);

export default router;
