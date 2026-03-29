import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-surface-700 bg-surface-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-white">
              SHOES<span className="text-brand-500">APP</span>
            </h3>
            <p className="mt-3 text-sm text-surface-300 max-w-xs">
              Premium footwear for every occasion. Quality, comfort, and style
              delivered to your doorstep.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/products" className="text-sm text-surface-300 hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?category=sneakers" className="text-sm text-surface-300 hover:text-white transition-colors">
                  Sneakers
                </Link>
              </li>
              <li>
                <Link href="/products?category=boots" className="text-sm text-surface-300 hover:text-white transition-colors">
                  Boots
                </Link>
              </li>
              <li>
                <Link href="/products?category=formal" className="text-sm text-surface-300 hover:text-white transition-colors">
                  Formal Shoes
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Contact
            </h4>
            <ul className="mt-4 space-y-2">
              <li className="text-sm text-surface-300">
                support@shoesapp.com
              </li>
              <li className="text-sm text-surface-300">
                +234 800 000 0000
              </li>
              <li className="text-sm text-surface-300">
                Lagos, Nigeria
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-surface-700 pt-6 text-center">
          <p className="text-sm text-surface-300">
            &copy; {new Date().getFullYear()} ShoesApp. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
