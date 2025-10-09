import Link from "next/link";
import { Facebook, Linkedin, Instagram } from "lucide-react";

export const AppFooter = () => {
  return (
    <footer
      id="contact"
      className="bg-primary text-white max-w-full px-4 md:px-10 lg:px-20 "
    >
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
              <Link
                href="https://www.facebook.com/phan.giang.1088893"
                className="hover:text-secondary"
              >
                <Facebook />
              </Link>
              <Link
                href="https://www.linkedin.com/in/giang-phan-nguyen-tra-2496471b4/"
                className="hover:text-secondary"
              >
                <Linkedin />
              </Link>
              <Link
                href="https://www.instagram.com/yyan.g293/"
                className="hover:text-secondary"
              >
                <Instagram />
              </Link>
            </div>
          </div>

          {/* Column 2: Products */}
          <div>
            <h4 className="font-bold text-lg mb-4">Products</h4>
            <ul className="space-y-2">
              <li>
                <Link href="" className="text-tint3 hover:text-[#dcdcdc]">
                  Landing page
                </Link>
              </li>
              <li>
                <Link href="#" className="text-tint3 hover:text-[#dcdcdc]">
                  About us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-tint3 hover:text-[#dcdcdc]">
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
                <span>📞</span>
                <a href="tel:+84926200400" className="hover:text-[#dcdcdc] ">
                  +84926200400
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span>✉️</span>
                <a
                  href="mailto:info@wordwise.we"
                  className="hover:text-[#dcdcdc] "
                >
                  info@wordwise.we
                </a>
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
            <Link href="#" className="hover:text-[#dcdcdc]">
              Terms & Conditions
            </Link>
            <Link href="#" className="hover:text-[#dcdcdc]">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
