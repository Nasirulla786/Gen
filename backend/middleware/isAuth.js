import jwt from "jsonwebtoken";
import BlackList from "../model/logout.blacklist.js";


const isAuth =  async(req , res , next)=>{
    try {
        const token = req.cookies.token;
        if(!token){
            return res.status(400).json({message:"UnAuthorizedUser"});
        }

        const tokenBlackList  = await BlackList.findOne({token})
        if(tokenBlackList){
            return
        }

        const verifyToken = jwt.verify(token ,"Secret");

        if(!verifyToken){
           return res.status(400).json({message:"UnAuthorizedUser"});
        }

        req.userId = verifyToken.id;
        next();


    } catch (error) {

        console.log("MiddleWare error", error);
    }
}


export default isAuth
