const Footer = () => {
  return (
    <footer className="bg-[#0d1442] py-10 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <img src="/logo.png" alt="WardDesk" className="h-7 w-auto" />
          <span className="text-lg font-bold text-white tracking-tight">
            WardDesk
          </span>
        </div>

        <p className="text-sm text-blue-300 italic mb-2">
          Building Better Communities Together
        </p>
        <p className="text-xs text-gray-400">
          © 2026 WardDesk. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
