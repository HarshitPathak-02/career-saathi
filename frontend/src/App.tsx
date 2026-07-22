import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import BrandIntro from "./shared/brand-intro/BrandIntro";

function App() {
  return (
    <>
      {/* <BrandIntro/> */}
      <RouterProvider router={router} />;
    </>
  )
}

export default App;