import express from 'express';
import {createbooking,cancelbooking} from "../controller/bookmanage_controller.js";

const router = express.Router();

router.post('/createbooking', createbooking);
router.post('/cancelbooking', cancelbooking);

export default router;