import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-16">

        <div className="grid gap-12 md:grid-cols-3">

          {/* Brand */}

          <div>

            <Link
              to="/"
              className="flex items-center gap-2"
            >
              <GraduationCap className="h-8 w-8 text-blue-600" />

              <span className="text-2xl font-bold">
                CareerSaathi
              </span>

            </Link>

            <p className="mt-5 leading-7 text-slate-600">
              Your AI Career Mentor helping aspiring developers
              learn consistently, stay focused and become job ready.
            </p>

          </div>

          {/* Product */}

          <div>

            <h3 className="font-semibold text-slate-900">
              Product
            </h3>

            <div className="mt-5 flex flex-col gap-3">

              <a href="#how-it-works" className="text-slate-600 hover:text-blue-600">
                How It Works
              </a>

              <a href="#features" className="text-slate-600 hover:text-blue-600">
                Features
              </a>

              <Link
                to="/login"
                className="text-slate-600 hover:text-blue-600"
              >
                Login
              </Link>

            </div>

          </div>

          {/* Legal */}

          <div>

            <h3 className="font-semibold text-slate-900">
              Legal
            </h3>

            <div className="mt-5 flex flex-col gap-3">

              <Link
                to="/privacy"
                className="text-slate-600 hover:text-blue-600"
              >
                Privacy Policy
              </Link>

              <Link
                to="/terms"
                className="text-slate-600 hover:text-blue-600"
              >
                Terms of Service
              </Link>

              <Link
                to="/contact"
                className="text-slate-600 hover:text-blue-600"
              >
                Contact
              </Link>

            </div>

          </div>

        </div>

        <div className="mt-16 border-t border-slate-200 pt-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} CareerSaathi. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;