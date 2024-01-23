import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { Logo } from "../assets/index.js";
import { loginWithPasswordAndUsername } from "../utils/api";
import UserContext from "../context/UserContext";

const UsernamePassLogin = () => {
  const { setUser, setAuthToken, setSystemNotif, preferences } =
    useContext(UserContext);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validUserName, setValidUserName] = useState(null);
  const [validPassword, setValidPassword] = useState(null);

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
      initial={{ opacity: 0, y: 50 }}
      exit={{ opacity: 0, y: 50, position: "absolute" }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { delay: 0.25 },
      }}
      onSubmit={loginPasswordUsername}
      className="flex flex-col items-center justify-center"
    >
      <input
        onChange={(e) => setUsername(e.target.value)}
        onBlur={() => checkValidInput("username")}
        type="text"
        placeholder="Username"
        value={username}
        id="username"
        name="username"
        className={`${
          validUserName === null
            ? ""
            : validUserName
            ? "shadow-green-200"
            : "shadow-red-200"
        } w-full p-2 my-2 rounded-md shadow-md focus:outline-none ${
          preferences.darkMode ? "bg-transparent" : "bg-white"
        }`}
      />
      <input
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        placeholder="Email"
        value={email}
        id="email"
        name="email"
        className={`w-full p-3 rounded-md shadow-md focus:outline-none ${
          preferences.darkMode ? "bg-transparent" : "bg-white"
        }`}
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        onBlur={() => checkValidInput("password")}
        type="password"
        placeholder="Password"
        value={password}
        id="password"
        name="password"
        className={`${
          validPassword === null
            ? ""
            : validPassword
            ? "shadow-green-200"
            : "shadow-red-200"
        } w-full p-3 my-2 rounded-md shadow-md focus:outline-none ${
          preferences.darkMode ? "bg-transparent" : "bg-white"
        }`}
      />
      <button
        type="submit"
        className="px-3 py-2 bg-cyan-100 rounded-md shadow-md w-full mt-4"
      >
        Sign In
      </button>
    </motion.form>
  );
};

export default UsernamePassLogin;
