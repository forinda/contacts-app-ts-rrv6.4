import "./index.css";

import Contact, {
  action as contactAction,
  loader as contactLoader,
} from "./routes/contact";
import EditContact, { action as editAction } from "./routes/edit";
import Root, {
  action as rootAction,
  loader as rootLoader,
} from "./routes/root";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import ErrorPage from "./errror-page";
import Index from "./routes";
import React from "react";
import ReactDOM from "react-dom/client";
import { action as destroyAction } from "./routes/destroy";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    action: rootAction,
    children: [
      {index: true, element: <Index/>},
      {
        path: "/contacts/:contactId",
        element: <Contact />,
        loader: contactLoader,
        action: contactAction,
      },
      {
        path: "/contacts/:contactId/edit",
        element: <EditContact />,
        loader: contactLoader,
        action: editAction,
      },
      {
        path: "/contacts/:contactId/destroy",
        action: destroyAction,
        errorElement: (
          <div style={{textAlign:'center',padding:'20px 0'}}>
            <>Something went wrong deleting the record</>
          </div>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
