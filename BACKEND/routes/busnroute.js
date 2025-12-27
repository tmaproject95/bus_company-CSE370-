import express from "express";
import { busroute } from "../controller/bus_route_controller.js";

const router = express.Router();

router.get('/',busroute);

export default router;


