import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { Button } from "../components/ui/button";

const LoginPage = () => {


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false)
  const { login } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // useEffect(() => {
  //   const isNew = localStorage.getItem("i18nextLng");
  //   if (isNew=='bn') {
  //     setPassword('demoPass');
  //     setEmail('demoEmail@.com');
  //   }
  // }, []);


  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true)
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("failedToLogIn");
    }
    finally{
      setLoading(false)
    }
  };


  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md">
        <form
          onSubmit={submitHandler}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <h1 className="text-2xl font-bold mb-4">{t("login")}</h1>
          {error && <p className="text-red-500 text-xs italic">{t(error)}</p>}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              {t("email")}
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              {t("password")}
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="******************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <Button
              circle={loading}
              loading={loading}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              {t("signIn")}
            </Button>
            <Link
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              to="/register"
            >
              {t("registerText")}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
