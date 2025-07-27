import { createBrowserRouter } from "react-router-dom";
import Root from "../layouts/Root";
import Home from "../pages/homepage/Home";
import Login from "../pages/login/Login";
import Signup from "../pages/signup/Signup";
import Quizzes from "../pages/quizzes/Quizzes";
import Contact from "../pages/contact/Contact";
import Quiz from "../pages/quizzes/Quiz";
import QuizCreator from "../pages/quizzes/QuizCreator";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "", element: <Home /> },
      { path: "signin", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "quizzes", element: <Quizzes /> },
      { path: "contact", element: <Contact /> },
      { path: "quiz/:id", element: <Quiz /> },
      { path: "create-quiz", element: <QuizCreator /> },
    ],
  },
]);

export default router;
