import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import store from "./store.js";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import Posts from "./pages/Posts.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import DetailPost from "./pages/DetailPost.jsx";

import { Provider } from "react-redux";
import EditPost from "./pages/EditPost.jsx";
import PrivateRoute from "./pages/PrivateRoute.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="" element={<PrivateRoute />}>
        <Route path="/posts" element={<Posts />} />
        <Route path="/posts/:id" element={<DetailPost />} />
        <Route path="/posts/:id/edit" element={<EditPost />} />
        <Route path="/posts/create" element={<CreatePost />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
