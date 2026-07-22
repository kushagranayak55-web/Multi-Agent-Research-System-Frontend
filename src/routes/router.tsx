import { createBrowserRouter } from "react-router-dom";

import { RootLayout } from "@/layouts/RootLayout";
import { LandingPage } from "@/pages/LandingPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { WorkspacePage } from "@/pages/WorkspacePage";
import { ROUTES } from "@/lib/constants";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: ROUTES.landing, element: <LandingPage /> },
      { path: ROUTES.workspace, element: <WorkspacePage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
