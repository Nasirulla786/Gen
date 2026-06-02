import jwt from "jsonwebtoken"

const generateToken = (id)=>{
    try {
        const token = jwt.sign({id} , "Secret");
        if(!token){
            console.log("token cant be generate");
            return
        }

        return token;

    } catch (error) {
        console.log(
            "token generate error", error

        );

    }
}


export default generateToken;
