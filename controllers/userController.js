import User from "../models/userModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { errorHandler } from "../utils/errorHandler.js";
import bycrpt from "bcryptjs";
import jwt from "jsonwebtoken";
//register
export const register = asyncHandler(async (req, res, next) => {
  const { fullName, username, password, gender } = req.body;
  console.log(fullName, username, password, gender);
  if (!fullName || !username || !password || !gender) {
    return next(new errorHandler("All fields are required", 400));
  }
  const user = await User.findOne({ username });
  if (user) {
    return next(new errorHandler("user already exists", 400));
  }
  const avatarType = gender === "male" ? "boy" : "girl";
  const avatar = `https://avatar.iran.liara.run/public/${avatarType}?username=${username}`;
  const hashPassword = await bycrpt.hash(password, 10);
  const newUser = await User.create({
    fullName,
    username,
    password: hashPassword,
    gender,
    avatar,
  });
  const tokenData = {
    _id: newUser?._id,
  };
  const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  res
    .status(200)
    .cookie("token", token, {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure:  true,
      sameSite: "None",
    })
    .json({
      success: true,
      responceData: newUser,
      token,
    });
});

//login
export const login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(
      new errorHandler("All fields are required", 400)
    );
  }
  const user = await User.findOne({ username });
  if (!user) {
    return next(
      new errorHandler("Please Enter valid username or password", 400)
    );
  }

  const isValidPasseord = await bycrpt.compare(password, user.password);
  if (!isValidPasseord) {
    return next(
      new errorHandler("Please Enter valid username or password", 400)
    );
  }
  const tokenData = {
    _id: user?._id,
  };
  const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  res
    .status(200)
    .cookie("token", token, {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure:true,
      sameSite: "None",
       
    })
    .json({
      success: true,
      user,
      token,
    });
});
//profile
export const getProfile = asyncHandler(async (req, res, next) => {
  const userId = req.user?._id;

  if (!userId) {
    return next(new errorHandler("User ID not found in token", 400));
  }

  const profile = await User.findById(userId).select("-password -refreshToken"); 

  if (!profile) {
    return next(new errorHandler("User profile not found", 404));
  }

  
  res.status(200).json({
    success: true,
    message: "Profile retrieved successfully",
    data: profile,  
  });
});
//logout
export const Logout = asyncHandler(async (req, res, next) => {
   res.status(200).cookie("token", "", {
      expires: new Date(
        Date.now()  
      ),
      httpOnly: true,
      
    }).json({
      success:true,
      messgae:"user logout successfully"
    })
});
// other user
export const getotherUsers = asyncHandler(async (req, res, next) => {
    const otherusers=await User.find({_id:{$ne:req.user?._id}})
    res.status(200).json({
      success:true,
      responceData:otherusers
    })
});