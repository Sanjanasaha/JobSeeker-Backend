import express from 'express';
import {getMyJobs, getAllJobs ,postJob, updateJob, deleteJob, getSinglejob } from '../controllers/jobController.js';
import { isAuthorized } from '../middlewares/authorization.js';

const router= express.Router();
router.get("/getall",getAllJobs);
router.post("/post",isAuthorized, postJob);
router.get("/getmyjob",isAuthorized, getMyJobs);
router.put("/updatejob/:id",isAuthorized, updateJob);
router.delete("/deletejob/:id",isAuthorized, deleteJob);
router.get("/:id",isAuthorized, getSinglejob);

export default router;