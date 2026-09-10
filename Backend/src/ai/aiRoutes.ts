import { Router } from "express";
import { summarize } from "./aiController";

const router = Router();

router.post("/summarize", summarize);

export default router;
