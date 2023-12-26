import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { useLoginMutation } from "../slices/userApiSlice";
import { setCredentials } from "../slices/authSlice";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login] = useLoginMutation();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const { userInfo } = useSelector((state) => state.auth);
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);
  console.log(redirect);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="w-[400px] mx-auto mt-8">
      <form
        className=" bg-gray-300 opacity-90 flex flex-col  p-6 rounded-lg mb-3 shadow-lg"
        onSubmit={submitHandler}
      >
        <div className="flex flex-col gap-1 text-lg">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-2 py-1 rounded-md"
            autoFocus
          />
          <label htmlFor="password">Password</label>
          <div className="relative flex flex-col">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-2 py-1 rounded-md"
            />
            <button
              className="absolute top-2 right-2 text-sm font-bold"
              type="button"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? "hide" : "show"}
            </button>
          </div>
        </div>

        <button
          className="bg-slate-900 py-2 text-white mt-4 mb-3 hover:opacity-80 rounded-md"
          type="submit"
        >
          Login
        </button>

        <div className="flex gap-2 justify-center">
          <span>New user? </span>
          <span className="text-blue-600 font-semibold">
            <Link
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
            >
              Sign up{" "}
            </Link>{" "}
          </span>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
