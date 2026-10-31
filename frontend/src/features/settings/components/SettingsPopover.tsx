import { useNavigate } from "react-router-dom";
import {
  LogOut,
  Settings,
  User,
  Compass,
} from "lucide-react";

interface Props {
  onLogout: () => void;
}

export default function SettingsPopover({ onLogout }: Props) {
  const navigate = useNavigate();

  return (
    <div
      className="
        absolute
        left-30
        bottom-5
        z-50
        w-64
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-xl
        animate-in
        fade-in
        zoom-in-95
      "
    >
      <div className="border-b border-slate-100 p-4">
        <div className="flex items-center gap-2">
          <Settings size={17} className="text-blue-600" />
          <span className="font-semibold text-slate-900">Account & Settings</span>
        </div>
      </div>

      <div className="p-2 space-y-1">
        <button
          type="button"
          onClick={() => navigate("/settings")}
          className="
            flex
            w-full
            items-center
            gap-3
            rounded-xl
            px-3
            py-2.5
            text-left
            text-sm
            font-medium
            text-slate-700
            transition-all
            hover:bg-slate-50
          "
        >
          <Settings size={17} className="text-slate-500" />
          <span>Settings</span>
        </button>

        <button
          type="button"
          onClick={() => navigate("/profile")}
          className="
            flex
            w-full
            items-center
            gap-3
            rounded-xl
            px-3
            py-2.5
            text-left
            text-sm
            font-medium
            text-slate-700
            transition-all
            hover:bg-slate-50
          "
        >
          <User size={17} className="text-slate-500" />
          <span>Profile & Passport</span>
        </button>

        <button
          type="button"
          onClick={() => navigate("/profile?tab=journeys")}
          className="
            flex
            w-full
            items-center
            gap-3
            rounded-xl
            px-3
            py-2.5
            text-left
            text-sm
            font-medium
            text-slate-700
            transition-all
            hover:bg-slate-50
          "
        >
          <Compass size={17} className="text-slate-500" />
          <span>Career Journeys</span>
        </button>

        <div className="border-t border-slate-100 my-1" />

        <button
          type="button"
          onClick={onLogout}
          className="
            flex
            w-full
            items-center
            gap-3
            rounded-xl
            px-3
            py-2.5
            text-left
            text-sm
            font-medium
            text-red-600
            transition-all
            hover:bg-red-50
          "
        >
          <LogOut size={17} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
