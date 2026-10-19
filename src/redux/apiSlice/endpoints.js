// src/redux/apiSlice/endpoints.js

export const endpoints = {
  //Auth API
  auth: {
    registration: "register",
    login: "login",
    sendOtp: "new-otp",
    otpVerifyLogin: "otp-verify",
    logout: "logout",
  },

  //Blog API endpoints
  blog: {
    // Public routes
    getAllBlogs: "get-all-blogs",
    getSitemapBlogs: "get-all-sitemap-blogs",
    getListBlogs: "get-list-blogs",
    getPopularBlogs: "get-popular-blogs",
    getBlogBySlug: "get-blog-by-slug",
    getBlogById: "get-blog-by-id",

    // Protected routes
    createBlog: "create-blog",
    updateBlog: "update-blog",
    deleteBlog: "delete-blog",
    toggleBlogStatus: "toggle-blog-status",
  },

  // Project API endpoints
  project: {
    // Public routes
    getAllProjects: "get-all-projects",
    getSitemapProjects: "get-all-sitemap-projects",
    getListProjects: "get-list-projects",
    getPopularProjects: "get-popular-projects",
    getProjectBySlug: "get-project-by-slug",
    getProjectById: "get-project-by-id",

    // Protected routes
    createProject: "create-project",
    updateProject: "update-project",
    deleteProject: "delete-project",
    toggleProjectStatus: "toggle-project-status",
  },

  // Home Banner API endpoints
  homeBanner: {
    // Public routes
    getActiveBanners: "get-active-banners",
    getHomeBannerList: "get-home-banner-list",
    getHomeBannerById: "get-home-banner-by-id",

    // Protected routes (Admin only)
    createHomeBanner: "create-home-banner",
    updateHomeBanner: "update-home-banner",
    deleteHomeBanner: "delete-home-banner",
    toggleHomeBannerStatus: "toggle-home-banner-status",
    updateBannerOrder: "update-banner-order",
  },

  // Home Company API endpoints
  homeCompany: {
    // Public routes
    getActiveCompanies: "get-active-companies",
    getHomeCompanyList: "get-home-company-list",
    getHomeCompanyById: "get-home-company-by-id",

    // Protected routes (Admin only)
    createHomeCompany: "create-home-company",
    updateHomeCompany: "update-home-company",
    deleteHomeCompany: "delete-home-company",
    toggleHomeCompanyStatus: "toggle-home-company-status",
    updateCompanyOrder: "update-company-order",
  },

  // Home Industry API endpoints
  homeIndustry: {
    // Public routes
    getActiveIndustries: "get-active-industries",
    getHomeIndustryList: "get-home-industry-list",
    getHomeIndustryById: "get-home-industry-by-id",

    // Protected routes (Admin only)
    createHomeIndustry: "create-home-industry",
    updateHomeIndustry: "update-home-industry",
    deleteHomeIndustry: "delete-home-industry",
    toggleHomeIndustryStatus: "toggle-home-industry-status",
    updateIndustryOrder: "update-industry-order",
  },

  // Home Alliance API endpoints
  homeAlliance: {
    // Public routes
    getAlliance: "get-alliance",
    getAllianceById: "get-alliance-by-id",

    // Protected routes (Admin only)
    createOrUpdateAlliance: "create-or-update-alliance",
    deleteAlliance: "delete-alliance",
    toggleAllianceStatus: "toggle-alliance-status",
    deleteAllianceImage: "delete-alliance-image",
  },

  // About API endpoints
  about: {
    // Public routes
    getAbout: "get-about",
    getAboutById: "get-about-by-id",

    // Protected routes (Admin only)
    createOrUpdateAbout: "create-or-update-about",
    toggleAboutStatus: "toggle-about-status",
  },

  setting: {
    // Public routes
    getSettings: "get-settings",
    getSettingsById: "get-settings-by-id",

    // Protected routes (Admin only)
    createOrUpdateSettings: "create-or-update-settings",
    toggleSettingsStatus: "toggle-settings-status",
  },

  // Client Message API endpoints
  clientMessage: {
    // Public routes
    createClientMessage: "create-client-message",

    // Protected routes (Admin only)
    getClientMessages: "get-client-messages",
    getClientMessageById: "get-client-message",
    deleteClientMessage: "delete-client-message",
    markMessageAsRead: "mark-message-as-read",
    markMessageAsReplied: "mark-message-as-replied",
    getUnreadCount: "get-unread-count",
    bulkDeleteMessages: "bulk-delete-messages",
  },

  testimonial: {
    // Public routes
    getActiveTestimonials: "get-active-testimonials",
    getTestimonialList: "get-testimonial-list",
    getTestimonialById: "get-testimonial-by-id",

    // Protected routes (Admin only)
    createTestimonial: "create-testimonial",
    updateTestimonial: "update-testimonial",
    deleteTestimonial: "delete-testimonial",
    toggleTestimonialStatus: "toggle-testimonial-status",
    updateTestimonialOrder: "update-testimonial-order",
  },

  package: {
    // Public routes
    getActivePackages: "get-active-packages",
    getPackageList: "get-package-list",
    getPackageById: "get-package-by-id",

    // Protected routes (Admin only)
    createPackage: "create-package",
    updatePackage: "update-package",
    deletePackage: "delete-package",
    togglePackageStatus: "toggle-package-status",
    updatePackageOrder: "update-package-order",
  },
};
