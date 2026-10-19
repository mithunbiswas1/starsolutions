// src/app/(home)/_components/BannerVideoBack.jsx

import Image from "next/image";
import { baseUriBackend } from "@/redux/url/url";

export const BannerVideoBack = ({ banners }) => {
  const bannerData =
    banners?.data?.banners?.[0] ||
    (Array.isArray(banners) ? banners[0] : null);

  const hasVideo = Boolean(bannerData?.url);
  const hasImage = Boolean(bannerData?.banner_image);

  return (
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-[#080c14]">
      {/* 1. If Video exists */}
      {hasVideo && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center" }}
        >
          <source src={bannerData.url} type="video/webm" />
        </video>
      )}

      {/* 2. If Image exists (and no video) */}
      {!hasVideo && hasImage && (
        <div className="relative w-full h-full">
          <Image
            src={`${baseUriBackend}${bannerData.banner_image}`}
            alt={bannerData?.first_title || "Banner"}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
      )}

      {/* 3. Stash Atmosphere: Ambient Radial Gradient Mesh for Glass Refraction */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-primary/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[350px] bg-secondary/20 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute -top-10 right-1/4 w-[450px] h-[300px] bg-primary/10 rounded-full blur-[110px] pointer-events-none" />

      {/* 4. Base Darkening Vignettes (behind the lines) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080c14]/65 via-[#080c14]/35 to-[#080c14] pointer-events-none" />
      {/* 5. Crisp Background Line Design: Geometric Tech Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_80%_65%_at_50%_40%,#000_65%,transparent_100%)] pointer-events-none z-[1]" />
    </div>
  );
};
