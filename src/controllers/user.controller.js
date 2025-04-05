import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiErrors.js";
import {User} from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler (async(req, res) => {

// get user details from frontend 
// validation not empty 
// check if user already exists: username, email 
// check for images, check for avatar 
// upload them to cloudinary, avatar 
// create user object create entry in db 
// remove password and refresh token field from response 
// check for user creation 
// return res

    const {fullName, email, username, password} = req.body;
    console.log("email: ",email);

    if(fullName === "") {
        throw new ApiError(400, "Full name is required");
    }
    else if(email === "") {
        throw new ApiError(400, "Email is required");
    }
    else if(username === "") {
        throw new ApiError(400, "username is required");
    }
    else if(password === "") {
        throw new ApiError(400, "password is required");
    }

    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    })

    console.log("existedUser: ",existedUser);

    if(existedUser) {
        throw new ApiError(409, "username or email already exists");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    console.log("local avatar path which is stored on server by multer : ", avatarLocalPath);

    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    console.log("local coverImage path which is stored on server by multer : ", coverImageLocalPath);

    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    console.log("avatar: ",avatar);
    if(!avatar) {
        throw new ApiError(400, "Avatar upload failed");
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    ) 

    if(!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    res.status(201).json(
        new ApiResponse(200,createdUser,"User Registered Successfully")
    )
})

export {registerUser}