import generateToken from "../config/token.js";
import BlackList from "../model/logout.blacklist.js";
import User from "../model/user.model.js";
import bcrypt from "bcryptjs";

export const RegisterController = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Required all fields" });
    }

    const alreadyExist = await User.findOne({ $or: [{ username }, { email }] });
    if (alreadyExist) {
      return res
        .status(400)
        .json({ message: "Username or email already exist" });
    }
    const hashPass = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashPass,
    });

    const token = await generateToken(newUser._id);

    res.cookie("token", token);

    res.status(201).json(newUser);
  } catch (error) {
    console.log("register error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const LoginController = async (req, res) => {
  try {


        const {  email, password } = req.body;
    if ( !email || !password) {
      return res.status(400).json({ message: "Required all fields" });
    }

    const alreadyExist = await User.findOne({email});

    if (!alreadyExist) {
      return res
        .status(400)
        .json({ message: "incorrect email or password" });
    }
    const isMatch = await bcrypt.compare(password ,alreadyExist.password );

    if(!isMatch){
         return res.status(400).json({ message: "incorrect email or password" });

    }


    const token = await generateToken(alreadyExist._id);

    res.cookie("token", token);

    res.status(201).json({message:"login Successfully"});
  } catch (error) {
    console.log("login error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const LogoutController = async (req, res) => {
  try {
    const token = req.cookies.token;
    if(token){
        await BlackList.create({token})
    }

    res.clearCookie("token");
  } catch (error) {
    console.log("logout error", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



export const CurrentUserController = async(req , res)=>{
    try {
        const userID = req.userId;
        if(!userID){
                  return res.status(400).json({ message: "firstly do login" });
        }

        const currentUser = await User.findById(userID);

    res.status(200).json(currentUser);


    } catch (error) {
            console.log("currentUser error", error);
    res.status(500).json({ message: "Internal Server Error" });

    }

}
