import express from "express";
import {
    makePayment,
    getBookingDetails,
    getUserBookings
} from "../controller/paymentController.js";

const router = express.Router();


router.post("/pay", makePayment);
router.get("/booking/:booking_id", getBookingDetails);
router.get("/user/:user_id", getUserBookings);

export default router;