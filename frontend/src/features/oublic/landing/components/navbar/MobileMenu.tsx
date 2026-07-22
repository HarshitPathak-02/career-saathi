import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const MobileMenu = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Toggle navigation"
      >
        {open ? <X size={28} /> : <Menu size={28} />}
      </button>

      {open && (
        <div className="absolute left-0 top-[72px] w-full border-t bg-white shadow-lg">
          <div className="flex flex-col gap-4 p-6">
            <Link to="/login" onClick={() => setOpen(false)}>
              Login
            </Link>

            <Link
              to="/register"
              onClick={() => setOpen(false)}
              className="rounded-lg bg-blue-600 px-4 py-3 text-center font-medium text-white"
            >
              Start Your Journey
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileMenu;