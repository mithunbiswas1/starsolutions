import Navbar from "@/components/common/Navbar/Navbar";
import Footer from "@/components/common/Footer/Footer";
import WhatsAppChatButton from "@/components/common/Whatsapp/WhatsAppChatButton";
import { getSettings } from "@/lib/getSettingApi";

export default async function PublicLayout({ children }) {
  const settingsData = await getSettings();

  return (
    <>
      <Navbar settings={settingsData} />
      <main className="min-h-screen bg-[#080c14] text-white">{children}</main>
      <Footer settings={settingsData} />
      <WhatsAppChatButton settings={settingsData} />
    </>
  );
}
