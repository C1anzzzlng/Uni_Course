import { Router, type IRouter } from "express";
import healthRouter from "./health";
import schoolsRouter from "./schools";
import programsRouter from "./programs";
import savedRouter from "./saved";
import assessmentRouter from "./assessment";
import usersRouter from "./users";
import statsRouter from "./stats";
import refreshRouter from "./refresh";

const router: IRouter = Router();

router.use(healthRouter);
router.use(schoolsRouter);
router.use(programsRouter);
router.use(savedRouter);
router.use(assessmentRouter);
router.use(usersRouter);
router.use(statsRouter);
router.use(refreshRouter);

export default router;
