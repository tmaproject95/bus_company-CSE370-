
import express from "express";
import {
    updateLiveLocation,
    getLiveLocation,
    getUserNotifications,
    markNotificationRead
} from "../controller/systemController.js";

const router = express.Router();


router.post("/location/update", updateLiveLocation);
router.get("/location/:trip_id", getLiveLocation);


router.get("/notifications/:user_id", getUserNotifications);
router.put("/notifications/read/:notification_id", markNotificationRead);

export default router;