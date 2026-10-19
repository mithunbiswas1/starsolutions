// src/components/layout/Footer.jsx

export default function Footer() {
  return (
    <footer className="sticky bottom-0 z-50 border-t border-gray-200 bg-white">
      <div className="flex h-14 items-center justify-between px-6">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Logi Craft IT. All rights reserved.
        </p>

        <span className="text-sm text-gray-400">Version 1.0.0</span>
      </div>
    </footer>
  );
}
