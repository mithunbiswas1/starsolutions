// src/lib/apiBridge.js

import { NextResponse } from "next/server";
import { connectDB } from "./db";
import { User } from "@/models/user.model";
import { ApiError } from "@/utils/apiError";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs/promises";
import { existsSync, mkdirSync } from "fs";
import { v4 as uuidv4 } from "uuid";

const uploadFolder = path.join(process.cwd(), "public/upload");
if (!existsSync(uploadFolder)) {
  mkdirSync(uploadFolder, { recursive: true });
}

export async function executeApiRoute(request, routeParams, routeConfig) {
  try {
    await connectDB();

    const { handler, isProtected = false } = routeConfig;
    const url = new URL(request.url);

    // Build req.query
    const query = {};
    url.searchParams.forEach((val, key) => {
      query[key] = val;
    });

    // Build req.params
    const params = routeParams || {};

    // Build req.body and req.files / req.file
    let body = {};
    let file = null;
    const files = {};

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();

      for (const [key, value] of formData.entries()) {
        if (value && typeof value === "object" && typeof value.arrayBuffer === "function") {
          const originalName = value.name || "upload.bin";
          const ext = path.extname(originalName) || ".png";
          const filename = `${Date.now()}-${uuidv4()}${ext}`;
          const filePath = path.join(uploadFolder, filename);

          const buffer = Buffer.from(await value.arrayBuffer());
          await fs.writeFile(filePath, buffer);

          const fileObj = {
            filename,
            originalname: originalName,
            mimetype: value.type || "application/octet-stream",
            size: value.size || buffer.length,
            path: `public/upload/${filename}`,
            destination: "public/upload",
          };

          if (!file) {
            file = fileObj;
          }

          if (!files[key]) {
            files[key] = [];
          }
          files[key].push(fileObj);
        } else {
          // Normal form text field
          body[key] = value;
        }
      }
    } else if (
      request.method === "POST" ||
      request.method === "PUT" ||
      request.method === "PATCH"
    ) {
      try {
        body = await request.json();
      } catch (e) {
        body = {};
      }
    }

    // Build req.cookies
    const cookiesObj = {};
    const cookieHeader = request.headers.get("cookie") || "";
    cookieHeader.split(";").forEach((c) => {
      const [k, v] = c.trim().split("=");
      if (k) cookiesObj[k] = decodeURIComponent(v || "");
    });

    const authHeader = request.headers.get("authorization") || "";
    const bearerToken = authHeader.replace(/^Bearer\s+/i, "");
    const token = bearerToken || cookiesObj.accessToken;

    let authUser = null;

    if (isProtected) {
      if (!token) {
        throw new ApiError(401, "Unauthorized request: No token provided");
      }

      let decodedToken;
      try {
        decodedToken = jwt.verify(
          token,
          process.env.ACCESS_TOKEN_SECRET || "logicraft_it_super_secret_access_token_key_2026"
        );
      } catch (error) {
        throw new ApiError(401, "Invalid or expired access token");
      }

      authUser = await User.findById(decodedToken._id).select(
        "-password -refreshToken"
      );

      if (!authUser) {
        throw new ApiError(401, "User not found");
      }
    }

    // Prepare mock req & res
    const req = {
      body,
      query,
      params,
      file,
      files,
      user: authUser,
      cookies: cookiesObj,
      header: (name) => request.headers.get(name),
      headers: request.headers,
      method: request.method,
      url: request.url,
    };

    let statusCode = 200;
    let responseData = null;
    const cookiesToSet = [];

    const res = {
      status(code) {
        statusCode = code;
        return res;
      },
      cookie(name, value, options = {}) {
        cookiesToSet.push({ name, value, options });
        return res;
      },
      clearCookie(name, options = {}) {
        cookiesToSet.push({
          name,
          value: "",
          options: { ...options, maxAge: 0 },
        });
        return res;
      },
      json(payload) {
        responseData = payload;
        return res;
      },
      send(payload) {
        responseData = payload;
        return res;
      },
    };

    // Execute the controller
    await handler(req, res);

    const nextResponse = NextResponse.json(responseData ?? {}, {
      status: statusCode,
    });

    // Apply any cookies set by controller
    for (const cookieItem of cookiesToSet) {
      nextResponse.cookies.set(cookieItem.name, cookieItem.value, cookieItem.options);
    }

    return nextResponse;
  } catch (error) {
    console.error("API Route Error:", error);
    const status = error.statusCode || 500;
    return NextResponse.json(
      {
        success: false,
        statusCode: status,
        message: error.message || "Internal Server Error",
        errors: error.errors || [error.message],
      },
      { status }
    );
  }
}
