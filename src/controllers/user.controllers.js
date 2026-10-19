import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating accessToken and refreshToken"
    );
  }
};

// User registration API
const registerUser = asyncHandler(async (req, res) => {
  const {
    userName,
    fullName,
    role,
    bio,
    email,
    password,
    phone,
    access,
    tradeLicenseNumber,
    tinNumber,
    binNumber,
    pstNumber,
  } = req.body;

  // Check required fields based on role
  if (!userName || !fullName || !role || !password || !phone) {
    throw new ApiError(400, "All required fields must be provided");
  }

  // ✅ IMPORTANT: Clean email field - empty string কে undefined করবেন
  const cleanedEmail = email && email.trim() !== "" ? email.trim() : undefined;

  // Check if user already exists (email check শুধু যখন email exists)
  const existingUserQuery = {
    $or: [{ userName }, { phone }]
  };

  // শুধুমাত্র email add করুন যখন email exists
  if (cleanedEmail) {
    existingUserQuery.$or.push({ email: cleanedEmail });
  }

  const existingUser = await User.findOne(existingUserQuery);

  if (existingUser) {
    const conflicts = [];
    if (existingUser.userName === userName) conflicts.push("username");
    if (existingUser.phone === phone) conflicts.push("phone");
    if (cleanedEmail && existingUser.email === cleanedEmail) conflicts.push("email");
    
    throw new ApiError(
      409,
      `${conflicts.join(", ")} already exists`
    );
  }

  // Handle file uploads
  const files = req.files || {};

  let userAccess = [];

  try {
    if (access) {
      // যদি access স্ট্রিং হিসেবে আসে (JSON stringified)
      if (typeof access === 'string') {
        userAccess = JSON.parse(access);
      } 
      // যদি array হিসেবে আসে
      else if (Array.isArray(access)) {
        userAccess = access;
      }
      
      // ভ্যালিডেশন চেক
      if (!Array.isArray(userAccess)) {
        throw new Error("Access must be an array");
      }

      // প্রতিটি access entry ভ্যালিডেশন
      userAccess = userAccess.map(entry => {
        if (!entry.routeKey || !Array.isArray(entry.permissions)) {
          throw new Error("Invalid access entry structure");
        }
        
        // শুধুমাত্র ভ্যালিড পারমিশনগুলো রাখুন
        const validPermissions = ["create", "read", "update", "delete"];
        const filteredPermissions = entry.permissions.filter(perm => 
          validPermissions.includes(perm)
        );
        
        return {
          routeKey: entry.routeKey,
          permissions: filteredPermissions.length > 0 ? filteredPermissions : ["read"] // ডিফল্ট read
        };
      });
    }
  } catch (error) {
    console.error("Access parsing error:", error);
    // ত্রুটি হলে ডিফল্ট access সেট করুন
    userAccess = [];
  }

  if (role === "admin") {
    userAccess = [];
    console.log("Setting empty access array for Super Admin");
  }

  const userData = {
    userName,
    fullName,
    bio,
    role,
    password,
    phone,
    access: userAccess,
    tradeLicenseNumber,
    tinNumber,
    binNumber,
    pstNumber,
    // ✅ email field শুধু তখনই add করুন যখন value exists
    ...(cleanedEmail && { email: cleanedEmail }),
    image: files.profilePhoto
      ? `public/upload/${files.profilePhoto[0].filename}`
      : undefined,
    nidFront: files.nidFront
      ? `public/upload/${files.nidFront[0].filename}`
      : undefined,
    nidBack: files.nidBack
      ? `public/upload/${files.nidBack[0].filename}`
      : undefined,
    tradeLicenseDocument: files.tradeLicenseDocument
      ? `public/upload/${files.tradeLicenseDocument[0].filename}`
      : undefined,
    tinDocument: files.tinDocument
      ? `public/upload/${files.tinDocument[0].filename}`
      : undefined,
    binDocument: files.binDocument
      ? `public/upload/${files.binDocument[0].filename}`
      : undefined,
    pstDocument: files.pstDocument
      ? `public/upload/${files.pstDocument[0].filename}`
      : undefined,
  };

  // Remove undefined fields
  Object.keys(userData).forEach((key) => {
    if (userData[key] === undefined) {
      delete userData[key];
    }
  });

  const user = await User.create(userData);
  const createUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createUser) {
    throw new ApiError(500, "Something went wrong while creating the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createUser, "User registered successfully"));
});

// User login API (unchanged)
const login = asyncHandler(async (req, res) => {
  const { email, phone, userName, password } = req.body;

  // Check if at least one identifier is provided
  if (!email && !phone && !userName) {
    throw new ApiError(400, "Email, phone or username is required");
  }

  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  let user;
  
  // Check by phone first (since it's required in schema)
  if (phone) {
    user = await User.findOne({ phone });
  } 
  // If not found by phone, check by email
  else if (email) {
    user = await User.findOne({ email });
  }
  // If not found by email, check by username
  else if (userName) {
    user = await User.findOne({ userName });
  }

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Check if user is active
  if (user.is_active === false) {
    throw new ApiError(403, "User account is deactivated");
  }

  const checkPassword = await user.isPasswordCorrect(password);

  if (!checkPassword) {
    throw new ApiError(401, "Invalid Password");
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  const loginUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const option = {
    httpOnly: true,
    // secure: true, // Enable in production
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(
      new ApiResponse(
        200,
        { user: loginUser, accessToken, refreshToken },
        "Login successfully!"
      )
    );
});

// Logout user (unchanged)
const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    { new: true }
  );

  const option = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json(new ApiResponse(200, {}, "Logout successfully!"));
});

// Refresh access token (unchanged)
const refreshAccessToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body.refreshToken;

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    throw new ApiError(401, "Invalid Refresh Token");
  }

  const user = await User.findById(decodedToken._id);

  if (!user) {
    throw new ApiError(401, "Invalid Refresh Token");
  }

  if (token !== user.refreshToken) {
    throw new ApiError(401, "Refresh token is expired or used");
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  const option = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken },
        "Access Token refreshed!"
      )
    );
});

// User update API
const updateUser = asyncHandler(async (req, res) => {
  const {
    userName,
    fullName,
    phone,
    email,
    address,
    city,
    thana,
    district,
    postal_code,
    country,
    tradeLicenseNumber,
    tinNumber,
    binNumber,
    pstNumber,
  } = req.body;

  const userId = req.user._id; // From auth middleware

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Check if username is being updated and if it's already taken
  if (userName && userName !== user.userName) {
    const existingUser = await User.findOne({
      userName,
      _id: { $ne: userId },
    });
    if (existingUser) {
      throw new ApiError(409, "Username already taken");
    }
  }

  // Check if phone is being updated and if it's already taken
  if (phone && phone !== user.phone) {
    const existingPhone = await User.findOne({
      phone,
      _id: { $ne: userId },
    });
    if (existingPhone) {
      throw new ApiError(409, "Phone number already registered");
    }
  }

  // Handle file uploads
  const files = req.files || {};

  const updateData = {
    ...(userName && { userName }),
    ...(fullName && { fullName }),
    ...(phone && { phone }),
    ...(email && { email }),
    ...(address && { address }),
    ...(thana && { thana }),
    ...(city && { city }),
    ...(district && { district }),
    ...(postal_code && { postal_code }),
    ...(country && { country }),
    ...(tradeLicenseNumber && { tradeLicenseNumber }),
    ...(tinNumber && { tinNumber }),
    ...(binNumber && { binNumber }),
    ...(pstNumber && { pstNumber }),
  };

  // Handle file updates
  if (files.profilePhoto) {
    updateData.image = `public/upload/${files.profilePhoto[0].filename}`;
  }
  if (files.nidFront) {
    updateData.nidFront = `public/upload/${files.nidFront[0].filename}`;
  }
  if (files.nidBack) {
    updateData.nidBack = `public/upload/${files.nidBack[0].filename}`;
  }
  if (files.tradeLicenseDocument) {
    updateData.tradeLicenseDocument = `public/upload/${files.tradeLicenseDocument[0].filename}`;
  }
  if (files.tinDocument) {
    updateData.tinDocument = `public/upload/${files.tinDocument[0].filename}`;
  }
  if (files.binDocument) {
    updateData.binDocument = `public/upload/${files.binDocument[0].filename}`;
  }
  if (files.pstDocument) {
    updateData.pstDocument = `public/upload/${files.pstDocument[0].filename}`;
  }

  // Update user
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $set: updateData,
    },
    {
      new: true, // Return updated document
      runValidators: true, // Run schema validators
    }
  ).select("-password -refreshToken");

  if (!updatedUser) {
    throw new ApiError(500, "Something went wrong while updating user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User updated successfully"));
});


const updateUser2 = asyncHandler(async (req, res) => {

  const {
    userName,
    fullName,
    phone,
    email,
    address,
    city,
    thana,
    district,
    postal_code,
    country,
    tradeLicenseNumber,
    tinNumber,
    binNumber,
    pstNumber,
    access, 
    role, 
    is_active, 
    bio,
    password, // শুধু newPassword
  } = req.body;

  const { userId } = req.params;

  console.log(userId,">>>>>>>>>>")

  // console.log("Received access:", req.body);
  // console.log("Type of access:", typeof access);

  // Check if user exists
  const user = await User.findById(userId);
  console.log(user,">>>>>>>>>>")

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Password update logic - শুধু newPassword থাকলে
  if (password) {
    // New password validation
    if (password.length < 6) {
      throw new ApiError(400, "Password must be at least 6 characters long");
    }

    // Update password (userSchema.pre("save") hook automatically hash করবে)
    user.password = password;
    await user.save({ validateBeforeSave: false });
  }

  // Check if username is being updated and if it's already taken
  if (userName && userName !== user.userName) {
    const existingUser = await User.findOne({
      userName,
      _id: { $ne: userId },
    });
    if (existingUser) {
      throw new ApiError(409, "Username already taken");
    }
  }

  // Check if phone is being updated and if it's already taken
  if (phone && phone !== user.phone) {
    const existingPhone = await User.findOne({
      phone,
      _id: { $ne: userId },
    });
    if (existingPhone) {
      throw new ApiError(409, "Phone number already registered");
    }
  }

  // Handle file uploads
  const files = req.files || {};

  const updateData = {
    ...(userName && { userName }),
    ...(fullName && { fullName }),
    ...(phone && { phone }),
    ...(email && { email }),
    ...(address && { address }),
    ...(city && { city }),
    ...(thana && { thana }),
    ...(district && { district }),
    ...(postal_code && { postal_code }),
    ...(country && { country }),
    ...(tradeLicenseNumber && { tradeLicenseNumber }),
    ...(tinNumber && { tinNumber }),
    ...(binNumber && { binNumber }),
    ...(pstNumber && { pstNumber }),
    ...(role && { role }),
    ...(bio && { bio }),
    ...(is_active !== undefined && { is_active }),
  };

  // Handle access field update
  if (access !== undefined) {
    let parsedAccess;
    
    try {
      // If access is a string, try to parse it as JSON
      if (typeof access === 'string') {
        parsedAccess = JSON.parse(access);
      } else {
        parsedAccess = access;
      }
      
      // Validate it's an array
      if (!Array.isArray(parsedAccess)) {
        throw new ApiError(400, "Access must be an array");
      }
      
      // Basic validation for access array structure
      const isValidAccess = parsedAccess.every(item => 
        item && 
        typeof item === 'object' && 
        item.routeKey && 
        item.permissions && 
        Array.isArray(item.permissions)
      );
      
      if (!isValidAccess) {
        throw new ApiError(400, "Invalid access structure. Each item must have routeKey and permissions array");
      }
      
      updateData.access = parsedAccess;
    } catch (parseError) {
      console.error("Error parsing access:", parseError);
      throw new ApiError(400, "Invalid access format. Must be a valid JSON array");
    }
  }

  // Handle file updates
  if (files.profilePhoto) {
    updateData.image = `public/upload/${files.profilePhoto[0].filename}`;
  }
  if (files.nidFront) {
    updateData.nidFront = `public/upload/${files.nidFront[0].filename}`;
  }
  if (files.nidBack) {
    updateData.nidBack = `public/upload/${files.nidBack[0].filename}`;
  }
  if (files.tradeLicenseDocument) {
    updateData.tradeLicenseDocument = `public/upload/${files.tradeLicenseDocument[0].filename}`;
  }
  if (files.tinDocument) {
    updateData.tinDocument = `public/upload/${files.tinDocument[0].filename}`;
  }
  if (files.binDocument) {
    updateData.binDocument = `public/upload/${files.binDocument[0].filename}`;
  }
  if (files.pstDocument) {
    updateData.pstDocument = `public/upload/${files.pstDocument[0].filename}`;
  }

  console.log("Update data:", updateData);

  // Update user other fields
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $set: updateData,
    },
    {
      new: true,
      runValidators: true,
    }
  ).select("-password -refreshToken");

  if (!updatedUser) {
    throw new ApiError(500, "Something went wrong while updating user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User updated successfully"));
});

// Update password
const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user._id;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "Current password and new password are required");
  }

  if (newPassword.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters long");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Verify current password
  const isPasswordCorrect = await user.isPasswordCorrect(currentPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Current password is incorrect");
  }

  // Update password
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password updated successfully"));
});

// Get user profile
// user.controllers.js - getUserProfile controller এ
const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId).select("-password -refreshToken");

  console.log(user,"user")

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Access field টা ঠিক করে পাঠানো
  const userResponse = {
    ...user.toObject(),
    access: Array.isArray(user.access) ? user.access : []
  };

  return res
    .status(200)
    .json(new ApiResponse(200, userResponse, "User profile fetched successfully"));
});

const getAuthorProfile = asyncHandler(async (req, res) => {
  const { userName } = req.params;


  const user = await User.findOne({userName:userName}).select("-password -refreshToken -access");

  console.log(user)


  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Access field টা ঠিক করে পাঠানো
  const userResponse = {
    ...user.toObject(),
    access: Array.isArray(user.access) ? user.access : []
  };

  return res
    .status(200)
    .json(new ApiResponse(200, userResponse, "User profile fetched successfully"));
});

// Admin can update any user (Optional - if you need admin functionality)
const updateUserByAdmin = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const {
    userName,
    fullName,
    email,
    phone,
    role,
    is_active,
    tradeLicenseNumber,
    tinNumber,
    binNumber,
    pstNumber,
  } = req.body;

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Check for duplicate username
  if (userName && userName !== user.userName) {
    const existingUser = await User.findOne({
      userName,
      _id: { $ne: userId },
    });
    if (existingUser) {
      throw new ApiError(409, "Username already taken");
    }
  }

  // Check for duplicate email
  if (email && email !== user.email) {
    const existingEmail = await User.findOne({
      email,
      _id: { $ne: userId },
    });
    if (existingEmail) {
      throw new ApiError(409, "Email already registered");
    }
  }

  // Check for duplicate phone
  if (phone && phone !== user.phone) {
    const existingPhone = await User.findOne({
      phone,
      _id: { $ne: userId },
    });
    if (existingPhone) {
      throw new ApiError(409, "Phone number already registered");
    }
  }

  const updateData = {
    ...(userName && { userName }),
    ...(fullName && { fullName }),
    ...(email && { email }),
    ...(phone && { phone }),
    ...(role && { role }),
    ...(is_active !== undefined && { is_active }),
    ...(tradeLicenseNumber && { tradeLicenseNumber }),
    ...(tinNumber && { tinNumber }),
    ...(binNumber && { binNumber }),
    ...(pstNumber && { pstNumber }),
  };

  // Handle file uploads
  const files = req.files || {};
  const fileFields = [
    "profilePhoto",
    "nidFront",
    "nidBack",
    "tradeLicenseDocument",
    "tinDocument",
    "binDocument",
    "pstDocument",
  ];

  fileFields.forEach((field) => {
    if (files[field]) {
      updateData[field === "profilePhoto" ? "image" : field] =
        `public/upload/${files[field][0].filename}`;
    }
  });

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $set: updateData,
    },
    {
      new: true,
      runValidators: true,
    }
  ).select("-password -refreshToken");

  if (!updatedUser) {
    throw new ApiError(500, "Something went wrong while updating user");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "User updated successfully by admin")
    );
});

const getListUsers = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 1000,
    search = "",
    sortBy = "createdAt",
    sortOrder = "desc",
    role,
    is_active = true // ডিফল্ট হিসেবে true সেট করুন
  } = req.query;

  // Build query object
  const query = {};
  
  // সবসময় শুধু active user দেখাবে
  // query.is_active = true;
  
  // Search functionality
  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { userName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } }
    ];
  }

  // Filter by role
  if (role) {
    query.role = role;
  }

  // Sort options
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

  // Execute query with pagination
  const users = await User.find(query)
    .select("-password -refreshToken") 
    .sort(sortOptions)
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  // Get total count for pagination
  const totalCount = await User.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          hasNext: page < Math.ceil(totalCount / limit),
          hasPrev: page > 1
        }
      },
      "Active users fetched successfully"
    )
  );
});

const getAllActiveAuthors = asyncHandler(async (req, res) => {
 

  // Build query object 
  const query = {
    role: "author",
    is_active: true
  };

  const authors = await User.find(query)
    .select("fullName email role image") 


  return res
    .status(200)
    .json(new ApiResponse(200, authors, "authors fetched successfully"));
});


// Delete user (self deletion)
const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Optional: Check password for confirmation (extra security)
  const { password } = req.body;
  if (password) {
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      throw new ApiError(401, "Invalid password");
    }
  }

  // Delete user
  await User.findByIdAndDelete(userId);

  // Clear cookies
  const option = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json(new ApiResponse(200, {}, "User deleted successfully"));
});

// Delete user by admin
const deleteUserByAdmin = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Optional: Prevent admin from deleting themselves
  if (userId.toString() === req.user._id.toString()) {
    throw new ApiError(400, "Admins cannot delete themselves");
  }

  // Delete user
  await User.findByIdAndDelete(userId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User deleted successfully by admin"));
});




export { registerUser, login, logout, refreshAccessToken,updateUser,updatePassword,getUserProfile,getAllActiveAuthors ,updateUserByAdmin,getListUsers,updateUser2,deleteUserByAdmin,getAuthorProfile};
