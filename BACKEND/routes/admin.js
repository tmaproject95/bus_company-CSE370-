import express from "express";
import {
    addVehicle,
    generateSeats,
    createRoute,
    createTrip,
    updateTripFare,
    updateTripStatus
} from "../controller/admincontroller.js";

const router = express.Router();


router.post("/vehicle", addVehicle);
router.post("/vehicle/seats", generateSeats);



router.post("/route", createRoute);
router.post("/trip", createTrip);


router.put("/trip/fare", updateTripFare);
router.put("/trip/status", updateTripStatus);

export default router;