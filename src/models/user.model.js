import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      sparse: true, 
      default: undefined, 
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    role: {
      type: String,
      enum: {
        values: ["admin","super_admin", "author"],
        message: "{VALUE} is not a valid role",
      },
      required: true,
    },
    bio: {
      type: String,
    },
    access: {
      type: [
        {
          routeKey: {
            type: String,
            required: true
          },
          permissions: {
            type: [String],
            enum: ["read", "write", "create", "update", "delete"],
            required: true
          }
        }
      ],
      default: []
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    thana: {
      type: String,
    },
    district: {
      type: String,
    },
    postal_code: {
      type: String,
    },
    country: {
      type: String,
    },
    image: {
      type: String,
    },
    nidFront: {
      type: String,
    },
    nidBack: {
      type: String,
    },
    tradeLicenseNumber: {
      type: String,
    },
    tradeLicenseDocument: {
      type: String,
    },
    tinNumber: {
      type: String,
    },
    tinDocument: {
      type: String,
    },
    binNumber: {
      type: String,
    },
    binDocument: {
      type: String,
    },
    pstNumber: {
      type: String,
    },
    pstDocument: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      userName: this.userName,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);