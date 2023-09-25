import { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { loginWithPasswordAndUsername } from "../utils/api";
import UserContext from "../context/UserContext";

const UsernamePassLogin = () => {
  const { setUser, setAuthToken, setSystemNotif } = useContext(UserContext);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validUserName, setValidUserName] = useState(null);
  const [validEmail, setValidEmail] = useState(null);
  const [validPassword, setValidPassword] = useState(null);

  const checkValidInput = (type) => {
    if (type === "username") {
      const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
      const isValid = usernameRegex.test(username);
      setValidUserName(isValid);
    }
    if (type === "email") {
      const emailRegex = /^[\w.-]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,})+$/;
      const isValid = emailRegex.test(email);
      setValidEmail(isValid);
    }
    if (type === "password") {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      const isValid = passwordRegex.test(password);
      setValidPassword(isValid);
    }
  };

  const loginPasswordUsername = (e) => {
    e.preventDefault();
    if (!validPassword || !validEmail || !validUserName) return showErrors();
    if (!password || !email || !username) return;
    const credentials = {
      username,
      email,
      password,
    };
    loginWithPasswordAndUsername(credentials)
      .then((res) => {
        setUser(res.data.user);
        setAuthToken(res.data.token);
        localStorage.setItem("authToken", res.data.token);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const showErrors = () => {
    const newError = {
      show: true,
      title: "Credentials",
      color: "bg-red-300",
      text: `Invalid ${!validUserName && "username"}, ${
        !validEmail && "email"
      }, ${
        !validPassword && "password"
      }. Please fill out the form registration for with valid credentials`,
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
      className="w-full flex flex-col items-center justify-center"
    >
      <input
        onChange={(e) => {
          setUsername(e.target.value);
          checkValidInput("username");
        }}
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
        } w-full p-2 my-2 rounded-md shadow-md`}
      />
      <AnimatePresence>
        {username && !validUserName && (
          <motion.div
            initial={{ scale: 0 }}
            exit={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <ul>
              <li>Must be between 3 - 21 characters</li>
              <li>Contain only letters, numbers, underscores & dashes</li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      <input
        onChange={(e) => {
          setEmail(e.target.value);
          checkValidInput("email");
        }}
        type="email"
        placeholder="Email"
        value={email}
        id="email"
        name="email"
        className={`${
          validEmail === null
            ? ""
            : validEmail
            ? "shadow-green-200"
            : "shadow-red-200"
        } w-full p-3 rounded-md shadow-md`}
      />
      <AnimatePresence>
        {email && !validEmail && (
          <motion.div
            initial={{ scale: 0 }}
            exit={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <ul>
              <li>Must be valid email address</li>
              <li>Must be valid email address</li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      <input
        onChange={(e) => {
          setPassword(e.target.value);
          checkValidInput("password");
        }}
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
        } w-full p-3 my-2 rounded-md shadow-md`}
      />
      <AnimatePresence>
        {password && !validPassword && (
          <motion.div
            initial={{ scale: 0 }}
            exit={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <ul>
              <li>Must be at least 8 characters</li>
              <li>Must contain at least 1 uppercase character</li>
              <li>Must contain at least 1 lowercase character</li>
              <li>Must contain at least 1 special character</li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        type="submit"
        className="px-3 py-2 bg-emerald-100 rounded-md shadow-md w-full mt-4"
      >
        Login
      </button>
      <button
        type="text"
        className="px-3 py-2 bg-lime-100 rounded-md shadow-md w-full mt-4"
      >
        Sign Up
      </button>
    </motion.form>
  );
};

export default UsernamePassLogin;
