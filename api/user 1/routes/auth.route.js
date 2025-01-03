import express from 'express';
import { google, signin, signup,signOut, test } from '../controllers/auth.controller.js';

const router = express.Router();

router.get('/test',test);
router.post('/signup',signup);
router.post("/signin", signin);
router.post('/google', google);
router.get('/signout', signOut);
export default router;