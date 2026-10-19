"use client";

import { useState } from "react";
import { FaWhatsapp, FaPhoneAlt, FaTimes } from "react-icons/fa";

export default function WhatsAppChatButton({ settings }) {
  const [isOpen, setIsOpen] = useState(false);

  // Function to open WhatsApp Chat in a popup
  const openWhatsAppPopup = () => {
    const url = `${settings?.data?.whatsapp}?text=Hello!`;
    window.open(url, "_blank", "width=400,height=600"); // Opens a small popup window
  };

  return (
    <div className="fixed bottom-5 right-5 flex flex-col items-end z-50">
      {/* Chatbox */}
      {isOpen && (
        <div className="bg-white shadow-lg rounded-lg w-64 p-4 mb-2 border border-gray-200">
          {/* Header with WhatsApp Call Button */}
          <div className="flex justify-between items-center border-b pb-2 mb-2">
            <a
              href={`${settings?.data?.whatsapp}?call=1`} // WhatsApp Direct Call
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-primary hover:text-primary"
            >
              <FaPhoneAlt className="mr-2" /> WhatsApp Call
            </a>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-primary"
            >
              <FaTimes size={18} />
            </button>
          </div>

          {/* WhatsApp Chat Button */}
          <button
            onClick={openWhatsAppPopup} // Opens chat in a small popup
            className="bg-primary text-white px-4 py-2 rounded-lg shadow-md flex items-center justify-center hover:bg-green-700 transition"
          >
            Open WhatsApp Chat
          </button>
        </div>
      )}

      {/* Floating WhatsApp Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-green-600 text-white p-2 rounded-full shadow-2xl hover:bg-primary transition flex items-center justify-center"
      >
        <FaWhatsapp className="w-5 h-5 md:w-8 md:h-8" />
      </button>
    </div>
  );
}
