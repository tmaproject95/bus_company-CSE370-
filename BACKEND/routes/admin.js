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

/* =========================
   FEATURE 4: VEHICLE & SEAT
========================= */
router.post("/vehicle", addVehicle);
router.post("/vehicle/seats", generateSeats);

/* =========================
   FEATURE 5: ROUTE & TRIP
========================= */
router.post("/route", createRoute);
router.post("/trip", createTrip);

/* =========================
   FEATURE 6: FARE & STATUS
========================= */
router.put("/trip/fare", updateTripFare);
router.put("/trip/status", updateTripStatus);

export default router;
