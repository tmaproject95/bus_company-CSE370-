import express from 'express';
import { createbooking, cancelbooking, getUserBookings } from "../controller/bookmanage_controller.js";




const router = express.Router();

router.post('/createbooking', createbooking);
router.post('/cancelbooking', cancelbooking);
router.get("/user/:userId", getUserBookings);

export default router;