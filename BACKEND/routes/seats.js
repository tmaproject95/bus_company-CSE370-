import express from "express";

import {seatinfo} from "../controller/seat_controller.js";

const router = express.Router();

router.get("/",seatinfo)
export default router;