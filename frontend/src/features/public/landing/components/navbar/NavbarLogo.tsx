import {
  Link,
} from "react-router-dom";

import logo from "../../../../../assets/logo.png"

const NavbarLogo = () => {

  return (

    <Link
      to="/"
      className="
                group
                flex
                items-center
                gap-3
            "
    >

      <img
        src={logo}
        alt="CareerSaathi Logo"
        className="max-h-20 w-auto object-contain"
      />

    </Link>

  );

};

export default NavbarLogo;