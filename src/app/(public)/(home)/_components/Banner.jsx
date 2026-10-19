import BannerCarousel from "../_clients/BannerCarousel";
import { bannerData as defaultBanners } from "../_data/bannerData";

export default function Banner({ banners }) {
  const dynamicBanners = banners?.data?.banners || [];
  const displayBanners = dynamicBanners.length > 0 ? dynamicBanners : defaultBanners;

  return <BannerCarousel banners={displayBanners} />;
}
