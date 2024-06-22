import { Router } from "express";
import { loginUser, logotOutUser, refreshAcessToken, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router =Router();

//ye to register ka likha hai 
router.route("/register").post(
    upload.fields([
        {
            name:"avatar", //ye tumahri frontend ke fields ka naam hai
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

router.route("/login").post(loginUser)

//yhn par secured routes likhe jaenge

router.route("/logout").post(verifyJWT,  logotOutUser)

router.route("/refresh-token").post(refreshAcessToken)

export default  router;