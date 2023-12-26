import React from "react";
import { Link } from "react-router-dom";
import { useLogoutUserMutation } from "../slices/userApiSlice";
import { logout } from "../slices/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutUser] = useLogoutUserMutation();

  const logoutHandler = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <nav className="bg-blue-200 py-2 flex justify-center items-center h-12 text-lg">
      <div className="flex gap-5">
        <span>
          <Link to="/" className="hover:border-b-4 hover:border-indigo-600">
            Home
          </Link>
        </span>
        {userInfo ? (
          <>
            <span>
              <Link
                to="/posts"
                className="hover:border-b-4 hover:border-indigo-600"
              >
                Posts
              </Link>
            </span>
            <span>
              <Link
                to="/posts/create"
                className="hover:border-b-4 hover:border-indigo-600"
              >
                Create Post
              </Link>
            </span>
            <span>
              <Link
                onClick={logoutHandler}
                className="hover:border-b-4 hover:border-indigo-600 "
              >
                Logout
              </Link>
            </span>
          </>
        ) : (
          <>
            <span>
              <Link
                to="/login"
                className="hover:border-b-4 hover:border-indigo-600 "
              >
                Login
              </Link>
            </span>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
