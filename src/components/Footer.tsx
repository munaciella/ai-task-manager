import { FaGithub, FaLinkedin } from "react-icons/fa";
import Link from "next/link";
import logo from "../../public/logo.png";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-slate-900/80 shadow text-gray-800 dark:text-gray-300 py-6 transition-colors">
      <div className="container mx-auto px-4">
        {/* Footer Top */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 xs:grid-cols-2 xs:gap-14">
          {/* About Section */}
          <div>
            <Link href="/" className="flex items-center gap-3 -mt-4">
              <Image src={logo} alt="Logo" width={60} height={60}></Image>
            </Link>
            <p className="text-md text-gray-600 dark:text-gray-400">
              Flowly is a powerful tool designed to help you manage your tasks efficiently. With a user-friendly interface and advanced
                features.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-900 dark:text-white text-lg font-bold mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/dashboard"
                  className="hover:underline underline-offset-4 hover:text-primary transition"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Contact */}
          <div>
            <h3 className="text-gray-900 dark:text-white text-lg font-bold mb-4">
              Get in touch
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="mailto:francesco.vurchio82@gmail.com"
                  className="hover:underline underline-offset-4 hover:text-primary transition"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-gray-900 dark:text-white text-lg font-bold mb-4">
              Follow Us
            </h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com/munaciella"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition"
                aria-label="GitHub"
              >
                <FaGithub
                  size={26}
                  className="hover:scale-110 transition-transform"
                />
              </a>
              <a
                href="https://linkedin.com/in/francesco-vurchio/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-500 transition"
                aria-label="LinkedIn"
              >
                <FaLinkedin
                  size={26}
                  className="hover:scale-110 transition-transform"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 dark:border-gray-700 mt-10"></div>

        {/* Footer Bottom */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <p>© Flowly {new Date().getFullYear()}.</p>
          <div className="flex items-center space-x-1 mt-3 sm:mt-0">
            <span>
              Made with{" "}
              <span className="text-red-500 dark:text-red-400 text-md">
                &#9825;
              </span>{" "}
              by
            </span>
            <Link
              href="https://francescovurchio-dev.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 text-primary font-semibold hover:underline"
            >
              francesco.dev
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
