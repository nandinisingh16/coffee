import express from "express";
import { createJob, getJobs, getJob } from "../controllers/job.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { applyToJob } from "../controllers/job.controller.js";
import { deleteJob } from "../controllers/job.controller.js";

const router = express.Router();

router.post("/", protectRoute, createJob);
router.get("/", getJobs);
router.get("/:id", getJob);
router.post("/apply", applyToJob);
router.delete("/:id", protectRoute, deleteJob);

export default router;