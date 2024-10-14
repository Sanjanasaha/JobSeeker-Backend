import express from 'express';
import { employerGetAllApplications , jobSeekerDeleteApplication , jobSeekererGetAllApplications ,postApplication } from '../controllers/appController.js';
import { isAuthorized } from '../middlewares/authorization.js';

const router= express.Router();

router.get("/jobseeker/getall",isAuthorized,jobSeekererGetAllApplications);
router.get("/employer/getall",isAuthorized ,employerGetAllApplications);
router.delete("/deletejob/:id",isAuthorized,jobSeekerDeleteApplication);
router.post("/post",isAuthorized,postApplication);

export default router;