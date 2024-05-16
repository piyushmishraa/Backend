import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router =Router();

//ye to register ka likha hai 
router.route("/register").post(
    upload.fields([
        {
            name:"avatar",//ye tumahri frontend ke fields ka naam hai
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1

        }

    ]),
    registerUser
);

//yhn login ka bhi likh sakte hain

export default  router;