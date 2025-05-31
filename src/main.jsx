import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import { Home } from "./pages/Home.jsx";
import { Tasks } from "./pages/Tasks.jsx";
import { Error } from "./pages/Error.jsx";
import { SettingPage } from "./pages/SettingPage.jsx";
import About from "./pages/About.jsx";
import { Privacy } from "./pages/Privacy.jsx";
import { HelpSupport } from "./pages/HelpSupport.jsx";
import { Account } from "./pages/Account.jsx";
import { NotesPage } from "./pages/NotesPage.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import WeatherPage from "./pages/WeatherPage.jsx";
import AnalyticsPage from "./pages/AnalyticsPage.jsx";
import Login from "./pages/Login.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/tasks",
        element: <Tasks />,
      },
      {
        path: "/analytics",
        element: <AnalyticsPage />,
      },
      {
        path: "/weather",
        element: <WeatherPage />,
      },
      {
        path: "/setting",
        element: <SettingPage />,
      },

      {
        path: "/notes",
        element: <NotesPage />,
      },
      {
        path: "/account",
        element: <Account />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/privacy",
        element: <Privacy />,
      },
      {
        path: "/help",
        element: <HelpSupport />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
