import Link from "next/link";
import { Facebook, Linkedin, Twitter } from "lucide-react"; // Cần cài `lucide-react`

export const Footer = () => {
  return (
    <footer id="contact" className="bg-primary text-white -mx-20 px-20">
      <div className="container mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12">
          {/* Column 1: Slogan & Social */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Word Wise</h3>
            <p className="text-tint3 max-w-sm mb-6">
              Fluency begins with mastering the essential vocabulary you need
              for real-life situations.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="hover:opacity-80">
                <Facebook />
              </Link>
              <Link href="#" className="hover:opacity-80">
                <Linkedin />
              </Link>
              <Link href="#" className="hover:opacity-80">
                <Twitter />
              </Link>
            </div>
          </div>

          {/* Column 2: Products */}
          <div>
            <h4 className="font-bold text-lg mb-4">Products</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-tint3 hover:text-white">
                  Landing page
                </Link>
              </li>
              <li>
                <Link href="#" className="text-tint3 hover:text-white">
                  About us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-tint3 hover:text-white">
                  Contact us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h4 className="font-bold text-lg mb-4">Contact information</h4>
            <ul className="space-y-2 text-tint3">
              <li className="flex items-center gap-2">
                <span>📞</span>+84926200400
              </li>
              <li className="flex items-center gap-2">
                <span>✉️</span>info@wordwise.we
              </li>
              <li className="flex items-center gap-2">
                <span>📍</span>Thu Duc, TP Ho Chi Minh
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-shape2">
        <div className="container mx-auto py-6 flex flex-col md:flex-row justify-between items-center text-sm text-tint3">
          <p>© 2023 Word Wise. All Rights Reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-white">
              Terms & Conditions
            </Link>
            <Link href="#" className="hover:text-white">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
