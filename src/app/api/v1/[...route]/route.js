// src/app/api/v1/[...route]/route.js

import { NextResponse } from "next/server";
import { executeApiRoute } from "@/lib/apiBridge";

// Import all controllers
import {
  registerUser,
  login,
  logout,
  refreshAccessToken,
  updateUser,
  updatePassword,
  getUserProfile,
  getAuthorProfile,
  updateUserByAdmin,
  getListUsers,
  updateUser2,
  getAllActiveAuthors,
  deleteUserByAdmin,
} from "@/controllers/user.controllers";

import {
  createBlog,
  getBlogById,
  getBlogBySlug,
  getAllBlogs,
  getListBlogs,
  updateBlog,
  deleteBlog,
  toggleBlogStatus,
  getPopularBlogs,
  getSitemapBlogs,
} from "@/controllers/blog.controllers";

import {
  createProject,
  getProjectById,
  getProjectBySlug,
  getAllProjects,
  getListProjects,
  updateProject,
  deleteProject,
  toggleProjectStatus,
  getPopularProjects,
  getSitemapProjects,
} from "@/controllers/project.controllers";

import {
  createHomeBanner,
  getHomeBannerById,
  getHomeBannerList,
  getActiveHomeBanners,
  updateHomeBanner,
  deleteHomeBanner,
  toggleHomeBannerStatus,
  updateBannerOrder,
} from "@/controllers/homeBanner.controller";

import {
  createHomeCompany,
  getHomeCompanyById,
  getHomeCompanyList,
  getActiveHomeCompanies,
  updateHomeCompany,
  deleteHomeCompany,
  toggleHomeCompanyStatus,
  updateCompanyOrder,
} from "@/controllers/homeCompany.controller";

import {
  createHomeIndustry,
  getHomeIndustryById,
  getHomeIndustryList,
  getActiveHomeIndustries,
  updateHomeIndustry,
  deleteHomeIndustry,
  toggleHomeIndustryStatus,
  updateIndustryOrder,
} from "@/controllers/homeIndustry.controller";

import {
  createOrUpdateAlliance,
  getAlliance,
  getAllianceById,
  deleteAlliance,
  toggleAllianceStatus,
  deleteAllianceImage,
} from "@/controllers/homeAlliance.controllers";

import {
  createOrUpdateAbout,
  getAbout,
  getAboutById,
  toggleAboutStatus,
} from "@/controllers/about.controller";

import {
  createOrUpdateSettings,
  getSettings,
  getSettingsById,
  toggleSettingsStatus,
} from "@/controllers/setting.controller";

import {
  createClientMessage,
  getClientMessages,
  getClientMessageById,
  deleteClientMessage,
  markMessageAsRead,
  markMessageAsReplied,
  getUnreadCount,
  bulkDeleteMessages,
} from "@/controllers/clientMessage.controller";

import {
  createTestimonial,
  getTestimonialById,
  getTestimonialList,
  getActiveTestimonials,
  updateTestimonial,
  deleteTestimonial,
  toggleTestimonialStatus,
  updateTestimonialOrder,
} from "@/controllers/testimonial.controller";

import {
  createPackage,
  getPackageById,
  getPackageList,
  getActivePackages,
  updatePackage,
  deletePackage,
  togglePackageStatus,
  updatePackageOrder,
} from "@/controllers/package.controller";

// API Route definitions: [method, path_segments, handler, isProtected]
const routes = [
  // User & Auth
  ["POST", ["register"], registerUser, false],
  ["POST", ["login"], login, false],
  ["POST", ["refresh-token"], refreshAccessToken, false],
  ["GET", ["get-list-users"], getListUsers, false],
  ["GET", ["get-all-author"], getAllActiveAuthors, false],
  ["POST", ["logout"], logout, true],
  ["GET", ["profile"], getUserProfile, true],
  ["GET", ["author-profile", ":userName"], getAuthorProfile, false],
  ["PATCH", ["update-profile"], updateUser, true],
  ["PATCH", ["update-user", ":userId"], updateUser2, false],
  ["PATCH", ["update-user-role", ":userId"], updateUser2, false],
  ["PATCH", ["update-password"], updatePassword, true],
  ["PATCH", ["admin", "update-user", ":userId"], updateUserByAdmin, true],
  ["DELETE", ["delete-user", ":userId"], deleteUserByAdmin, true],

  // Blogs
  ["GET", ["get-all-blogs"], getAllBlogs, false],
  ["GET", ["get-all-sitemap-blogs"], getSitemapBlogs, false],
  ["GET", ["get-list-blogs"], getListBlogs, false],
  ["GET", ["get-popular-blogs"], getPopularBlogs, false],
  ["GET", ["get-blog-by-slug", ":slug"], getBlogBySlug, false],
  ["GET", ["get-blog-by-id", ":id"], getBlogById, false],
  ["POST", ["create-blog"], createBlog, true],
  ["PUT", ["update-blog", ":id"], updateBlog, true],
  ["DELETE", ["delete-blog", ":id"], deleteBlog, true],
  ["PATCH", ["toggle-blog-status", ":id"], toggleBlogStatus, true],

  // Projects
  ["GET", ["get-all-projects"], getAllProjects, false],
  ["GET", ["get-all-sitemap-projects"], getSitemapProjects, false],
  ["GET", ["get-list-projects"], getListProjects, false],
  ["GET", ["get-popular-projects"], getPopularProjects, false],
  ["GET", ["get-project-by-slug", ":slug"], getProjectBySlug, false],
  ["GET", ["get-project-by-id", ":id"], getProjectById, false],
  ["POST", ["create-project"], createProject, true],
  ["PUT", ["update-project", ":id"], updateProject, true],
  ["DELETE", ["delete-project", ":id"], deleteProject, true],
  ["PATCH", ["toggle-project-status", ":id"], toggleProjectStatus, true],

  // Home Banners
  ["GET", ["get-active-banners"], getActiveHomeBanners, false],
  ["GET", ["get-home-banner-list"], getHomeBannerList, false],
  ["GET", ["get-home-banner-by-id", ":id"], getHomeBannerById, false],
  ["POST", ["create-home-banner"], createHomeBanner, true],
  ["PUT", ["update-home-banner", ":id"], updateHomeBanner, true],
  ["DELETE", ["delete-home-banner", ":id"], deleteHomeBanner, true],
  ["PATCH", ["toggle-home-banner-status", ":id"], toggleHomeBannerStatus, true],
  ["PUT", ["update-banner-order"], updateBannerOrder, true],

  // Home Companies
  ["GET", ["get-active-companies"], getActiveHomeCompanies, false],
  ["GET", ["get-home-company-list"], getHomeCompanyList, false],
  ["GET", ["get-home-company-by-id", ":id"], getHomeCompanyById, false],
  ["POST", ["create-home-company"], createHomeCompany, true],
  ["PUT", ["update-home-company", ":id"], updateHomeCompany, true],
  ["DELETE", ["delete-home-company", ":id"], deleteHomeCompany, true],
  ["PATCH", ["toggle-home-company-status", ":id"], toggleHomeCompanyStatus, true],
  ["PUT", ["update-company-order"], updateCompanyOrder, true],

  // Home Industries
  ["GET", ["get-active-industries"], getActiveHomeIndustries, false],
  ["GET", ["get-home-industry-list"], getHomeIndustryList, false],
  ["GET", ["get-home-industry-by-id", ":id"], getHomeIndustryById, false],
  ["POST", ["create-home-industry"], createHomeIndustry, true],
  ["PUT", ["update-home-industry", ":id"], updateHomeIndustry, true],
  ["DELETE", ["delete-home-industry", ":id"], deleteHomeIndustry, true],
  ["PATCH", ["toggle-home-industry-status", ":id"], toggleHomeIndustryStatus, true],
  ["PUT", ["update-industry-order"], updateIndustryOrder, true],

  // Home Alliance
  ["GET", ["get-alliance"], getAlliance, false],
  ["GET", ["get-alliance-by-id", ":id"], getAllianceById, true],
  ["POST", ["create-or-update-alliance"], createOrUpdateAlliance, true],
  ["DELETE", ["delete-alliance", ":id"], deleteAlliance, true],
  ["PATCH", ["toggle-alliance-status", ":id"], toggleAllianceStatus, true],
  ["DELETE", ["delete-alliance-image", ":id", ":imageKey"], deleteAllianceImage, true],

  // About
  ["GET", ["get-about"], getAbout, false],
  ["GET", ["get-about-by-id", ":id"], getAboutById, false],
  ["POST", ["create-or-update-about"], createOrUpdateAbout, true],
  ["PATCH", ["toggle-about-status", ":id"], toggleAboutStatus, true],

  // Settings
  ["GET", ["get-settings"], getSettings, false],
  ["GET", ["get-settings-by-id", ":id"], getSettingsById, false],
  ["POST", ["create-or-update-settings"], createOrUpdateSettings, true],
  ["PATCH", ["toggle-settings-status", ":id"], toggleSettingsStatus, true],

  // Client Messages
  ["POST", ["create-client-message"], createClientMessage, false],
  ["GET", ["get-client-messages"], getClientMessages, true],
  ["GET", ["get-client-message", ":id"], getClientMessageById, true],
  ["DELETE", ["delete-client-message", ":id"], deleteClientMessage, true],
  ["PATCH", ["mark-message-as-read", ":id"], markMessageAsRead, true],
  ["PATCH", ["mark-message-as-replied", ":id"], markMessageAsReplied, true],
  ["GET", ["get-unread-count"], getUnreadCount, true],
  ["POST", ["bulk-delete-messages"], bulkDeleteMessages, true],

  // Testimonials
  ["GET", ["get-active-testimonials"], getActiveTestimonials, false],
  ["GET", ["get-testimonial-list"], getTestimonialList, false],
  ["GET", ["get-testimonial-by-id", ":id"], getTestimonialById, false],
  ["POST", ["create-testimonial"], createTestimonial, true],
  ["PUT", ["update-testimonial", ":id"], updateTestimonial, true],
  ["DELETE", ["delete-testimonial", ":id"], deleteTestimonial, true],
  ["PATCH", ["toggle-testimonial-status", ":id"], toggleTestimonialStatus, true],
  ["PUT", ["update-testimonial-order"], updateTestimonialOrder, true],

  // Packages
  ["GET", ["get-active-packages"], getActivePackages, false],
  ["GET", ["get-package-list"], getPackageList, false],
  ["GET", ["get-package-by-id", ":id"], getPackageById, false],
  ["POST", ["create-package"], createPackage, true],
  ["PUT", ["update-package", ":id"], updatePackage, true],
  ["DELETE", ["delete-package", ":id"], deletePackage, true],
  ["PATCH", ["toggle-package-status", ":id"], togglePackageStatus, true],
  ["PUT", ["update-package-order"], updatePackageOrder, true],
];

function matchRoute(method, pathSegments) {
  for (const [routeMethod, patternSegments, handler, isProtected] of routes) {
    if (routeMethod !== method) continue;
    if (patternSegments.length !== pathSegments.length) continue;

    const params = {};
    let matched = true;

    for (let i = 0; i < patternSegments.length; i++) {
      const patternSeg = patternSegments[i];
      const actualSeg = pathSegments[i];

      if (patternSeg.startsWith(":")) {
        const paramName = patternSeg.slice(1);
        params[paramName] = actualSeg;
      } else if (patternSeg !== actualSeg) {
        matched = false;
        break;
      }
    }

    if (matched) {
      return { handler, isProtected, params };
    }
  }

  return null;
}

async function handle(request, context) {
  const resolvedParams = await context.params;
  const pathSegments = resolvedParams?.route || [];
  const method = request.method;

  const matched = matchRoute(method, pathSegments);

  if (!matched) {
    return NextResponse.json(
      {
        success: false,
        statusCode: 404,
        message: `API Route not found: ${method} /api/v1/${pathSegments.join("/")}`,
      },
      { status: 404 }
    );
  }

  return executeApiRoute(request, matched.params, {
    handler: matched.handler,
    isProtected: matched.isProtected,
  });
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
