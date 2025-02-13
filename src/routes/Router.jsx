import { createBrowserRouter } from "react-router-dom";
import Root from "../layouts/Root";
import Home from "../pages/homepage/Home";
import Login from "../pages/login/Login";
import Signup from "../pages/signup/Signup";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "", element: <Home /> },
      { path: "signin", element: <Login /> },
      { path: "signup", element: <Signup /> },
    ],
  },
]);

export default router;
