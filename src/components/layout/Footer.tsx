import Link from "next/link";

export function Footer() {
  return (
    <>
      {/* Footer */}
      <footer className="bg-footer text-[#f4f4f4] pt-11 px-5 md:px-12">
        <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr] gap-8 pb-9">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-[14px]">
              <span className="font-serif text-[24px] font-bold">GeemanFootwears</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[19px] font-bold m-0 mb-4">Quick Links</h4>
            <Link
              href="/products"
              className="block text-[#dcdcdc] no-underline text-[17px] mb-[14px] w-fit transition-colors duration-150 hover:text-white"
            >
              Products
            </Link>
            <Link
              href="/admin"
              className="block text-[#dcdcdc] no-underline text-[17px] mb-[14px] w-fit transition-colors duration-150 hover:text-white"
            >
              Admin
            </Link>
          </div>

          {/* Follow */}
          <div>
            <h4 className="text-[19px] font-bold m-0 mb-4">Follow Us</h4>
            <div className="flex gap-[22px]">
              <a
                href="https://instagram.com/geemanfootwears"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#f4f4f4] inline-flex transition-opacity duration-150 hover:opacity-75"
              >
                <svg viewBox="0 0 24 24" width="26" height="26">
                  <g fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
                  </g>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-[1500px] mx-auto border-t border-[#2a2a2a] text-center py-[22px] text-[#cfcfcf] text-[15px]">
          &copy; 2026 GeemanFootwears. All rights reserved.
        </div>
      </footer>
    </>
  );
}
