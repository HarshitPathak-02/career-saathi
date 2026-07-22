import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";

const NavbarLogo = () => {
  return (
    <Link to="/" className="flex items-center gap-2">
      <GraduationCap className="h-8 w-8 text-blue-600" />

      <span className="text-xl font-bold text-slate-900">
        CareerSaathi
      </span>
    </Link>
  );
};

export default NavbarLogo;