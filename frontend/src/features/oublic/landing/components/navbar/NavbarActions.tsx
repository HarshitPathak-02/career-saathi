import { Link } from "react-router-dom";

const NavbarActions = () => {
  return (
    <div className="flex items-center gap-4">
      <Link
        to="/login"
        className="rounded-lg px-4 py-2 font-medium text-slate-700 transition hover:text-blue-600"
      >
        Login
      </Link>

      <Link
        to="/register"
        className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700"
      >
        Start Your Journey
      </Link>
    </div>
  );
};

export default NavbarActions;