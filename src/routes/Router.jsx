import { createBrowserRouter } from "react-router-dom";
import Root from "../layouts/Root";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    // children:
  },
]);

export default router;