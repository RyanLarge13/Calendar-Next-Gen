import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import UserContext from "../../../context/UserContext";
import { loginWithPasswordAndUsername } from "../../../utils/api";

const UsernamePassLogin = () => {
  const { setUser, setAuthToken, setSystemNotif, preferences } =
    useContext(UserContext);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validUserName, setValidUserName] = useState(null);
  const [validPassword, setValidPassword] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!password || validPassword) {
      setSystemNotif({ show: false });
    }
    if (!username || validUserName) {
      setSystemNotif({ show: false });
    }
    if (username && !validUserName) {
      const newError = {
        show: true,
        title: "Invalid Username",
        text: "Please input a valid username: A username must be:\n\n - At least 4 letters\n - cannot be greater than 20 characters\n - usernames can contain only letters, numbers, underscores and dashes",
        color: "bg-red-200",
        hasCancel: true,
        actions: [
          { text: "close", func: () => setSystemNotif({ show: false }) },
        ],
      };
      setSystemNotif(newError);
    }
    if (password && !validPassword) {
      const newError = {
        show: true,
        title: "Invalid Password",
        text: "Please input a valid password: A password must be:\n\n - At least 8 characters long\n - Have at least one uppercase character\n - One lowercase character\n - One number\n - And at least 2 special characters '@, $, !, %, *, ? or &'",
        color: "bg-red-200",
        hasCancel: true,
        actions: [
          { text: "close", func: () => setSystemNotif({ show: false }) },
        ],
      };
      setSystemNotif(newError);
    }
  }, [validUserName, validPassword]);

  const checkValidInput = (type) => {
    if (type === "username") {
      if (typeof username !== "string") {
        return setValidUserName(null);
      }
      const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
      const isValid = usernameRegex.test(username);
      if (!username) {
        return setValidUserName(null);
      }
      setValidUserName(isValid);
    }
    if (type === "password") {
      if (typeof password !== "string") {
        return setValidPassword(null);
      }
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      const isValid = passwordRegex.test(password);
      if (!password) {
        return setValidPassword(null);
      }
      setValidPassword(isValid);
    }
  };

  const loginPasswordUsername = (e) => {
    e.preventDefault();
    if (!validPassword || !validUserName) return showErrors();
    if (!password || !email || !username) return;
    const credentials = {
      username,
      email,
      password,
      avatarUrl: "",
    };
    loginWithPasswordAndUsername(credentials)
      .then((res) => {
        setAuthToken(res.data.token);
        localStorage.setItem("authToken", res.data.token);
      })
      .catch((err) => {
        console.log(err);
        setUser(false);
        setAuthToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
      });
  };

  const showErrors = () => {
    const newError = {
      show: true,
      title: "Credentials",
      color: "bg-red-300",
      text: `Invalid ${!validUserName && "username"}, ${
        !validPassword && "password"
      }. Please fill out the form registration with valid credentials`,
      hasCancel: true,
      actions: [{ text: "close", func: () => setSystemNotif({ show: false }) }],
    };
    setSystemNotif(newError);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 40 }}
      exit={{ opacity: 0, y: 40, position: "absolute" }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { delay: 0.2, ease: "easeOut" },
      }}
      onSubmit={loginPasswordUsername}
      className="flex flex-col items-center justify-center w-full gap-y-4"
    >
      {/* Username */}
      <input
        onChange={(e) => setUsername(e.target.value)}
        onBlur={() => checkValidInput("username")}
        type="text"
        placeholder="Username"
        value={username}
        id="username"
        name="username"
        className={`
      w-full rounded-xl px-4 py-3 text-sm
      backdrop-blur-md
      transition-all duration-200
      border
      ${
        validUserName === null
          ? "border-cyan-200"
          : validUserName
            ? "border-emerald-300 ring-1 ring-emerald-200"
            : "border-red-300 ring-1 ring-red-200"
      }
      focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-cyan-300
      hover:bg-cyan-50
      shadow-sm
      ${preferences.darkMode ? "bg-white/5 text-white" : "bg-white text-slate-800"}
    `}
      />

      {/* Email */}
      <input
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        placeholder="Email"
        value={email}
        id="email"
        name="email"
        className={`
      w-full rounded-xl px-4 py-3 text-sm
      backdrop-blur-md
      transition-all duration-200
      border border-cyan-200
      focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-cyan-300
      hover:bg-cyan-50
      shadow-sm
      ${preferences.darkMode ? "bg-white/5 text-white" : "bg-white text-slate-800"}
    `}
      />

      {/* Password */}
      <input
        onChange={(e) => setPassword(e.target.value)}
        onBlur={() => checkValidInput("password")}
        type="password"
        placeholder="Password"
        value={password}
        id="password"
        name="password"
        className={`
      w-full rounded-xl px-4 py-3 text-sm
      backdrop-blur-md
      transition-all duration-200
      border
      ${
        validPassword === null
          ? "border-cyan-200"
          : validPassword
            ? "border-emerald-300 ring-1 ring-emerald-200"
            : "border-red-300 ring-1 ring-red-200"
      }
      focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-cyan-300
      hover:bg-cyan-50
      shadow-sm
      ${preferences.darkMode ? "bg-white/5 text-white" : "bg-white text-slate-800"}
    `}
      />

      {/* Submit */}
      <button
        disabled={loading}
        type="submit"
        className={`
      w-full mt-5 rounded-xl px-4 py-3 text-sm font-medium
      transition-all duration-200
      bg-gradient-to-r from-cyan-400 to-cyan-500
      text-white
      shadow-md
      hover:shadow-lg hover:scale-[1.015]
      focus:outline-none focus:ring-2 focus:ring-cyan-300
      disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
      will-change-transform
    `}
      >
        {loading ? "Signing in…" : "Continue"}
      </button>
    </motion.form>
  );
};

export default UsernamePassLogin;
