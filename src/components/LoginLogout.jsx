import { useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGoogleLogin } from "@react-oauth/google";
import { BiLogInCircle, BiLogOutCircle } from "react-icons/bi";
import { BsFillBellFill } from "react-icons/bs";
import { loginWithPasswordAndUsername, updateNotification } from "../utils/api";
import UserContext from "../context/UserContext";
import InteractiveContext from "../context/InteractiveContext";
import Notification from "./Notification";

const LoginLogout = () => {
  const { showLogin, setShowLogin, showNotifs, setShowNotifs } =
    useContext(InteractiveContext);
  const {
    user,
    setUser,
    setGoogleToken,
    loginLoading,
    notifications,
    setNotifications,
    setAuthToken,
    setEvents,
    setReminders,
    setLists,
  } = useContext(UserContext);

  const [regularLogin, setRegularLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validUserName, setValidUserName] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [unReadLength, setUnReadLength] = useState(0);
  const [idsToUpdate, setIdsToUpdate] = useState([]);

  useEffect(() => {
    if (idsToUpdate.length > 0) {
      updateNotification(
        idsToUpdate,
        localStorage.getItem("authToken"),
        user.username
      )
        .then((res) => {
          console.log(res);
          setIdsToUpdate([]);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [showNotifs]);

  useEffect(() => {
    const unReadNotifs = notifications.filter(
      (notif) => notif.read === false
    ).length;
    setUnReadLength(unReadNotifs);
  }, [notifications]);

  const loginGoogle = useGoogleLogin({
    onSuccess: (res) => {
      setGoogleToken(res.access_token);
    },
    onError: () => {
      setUser(false);
      setGoogleToken(false);
    },
  });

  // const loginFacebook = () => {};

  // const loginGithub = () => {};

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
    if (!validPassword || !validEmail || !validUserName) return
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

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("events");
    localStorage.removeItem("reminders");
    // localStorage.setItem("events", JSON.stringify(events));
    setAuthToken(false);
    setUser(false);
    setEvents([]);
    setNotifications([]);
    setReminders([]);
    setLists([]);
  };

  return (
    <>
      <Notification idsToUpdate={idsToUpdate} setIdsToUpdate={setIdsToUpdate} />
      <AnimatePresence>
        {showLogin && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => {
                if (showNotifs) return setShowNotifs(false);
                setShowLogin(false);
              }}
              className="fixed inset-0 bg-[rgba(0,0,0,0.4)] z-10"
            ></motion.div>
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              exit={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="p-3 fixed bottom-0 left-0 right-0 rounded-md shadow-md bg-white z-10"
            >
              {user ? (
                <div className="">
                  <div className="flex justify-between items-center bg-purple-100 rounded-md shadow-md p-2 mb-5">
                    <BiLogOutCircle
                      onClick={() => logout()}
                      className="text-xl abolute left-2 top-2 cursor-pointer"
                    />
                    <div
                      onClick={() => setShowNotifs((prev) => !prev)}
                      className="relative cursor-pointer"
                    >
                      {unReadLength > 0 && (
                        <div
                          className={`absolute flex justify-center items-center top-[-8px] right-[-8px] rounded-full shadow-md w-[15px] h-[15px] bg-red-300 text-[12px]`}
                        >
                          {unReadLength > 9 ? "9+" : unReadLength}
                        </div>
                      )}
                      <BsFillBellFill />
                    </div>
                  </div>
                  <img
                    src={user.avatarUrl}
                    alt="user"
                    className="w-[50px] h-[50px] rounded-full shadow-sm"
                  />
                  <div className="text-xs font-bold mt-2">
                    <p>{user.username}</p>
                    <a href={`mailto:${user.email}`}>
                      <p>{user.email}</p>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="pt-10 flex flex-col justify-center items-center">
                  {!regularLogin ? (
                    <BiLogInCircle
                      onClick={() => setRegularLogin(true)}
                      className="absolute top-5 right-5"
                    />
                  ) : (
                    <BiLogOutCircle
                      onClick={() => setRegularLogin(false)}
                      className="absolute top-5 right-5"
                    />
                  )}
                  <AnimatePresence>
                    {regularLogin && (
                      <motion.form
                        initial={{ opacity: 0, y: "100%" }}
                        exit={{ opacity: 0, y: "100%", position: "absolute" }}
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
                            validUserName ? "" : "shadow-red-200"
                          } w-full p-2 my-2 rounded-md shadow-md`}
                        />
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
                            validEmail ? "shadow-green-200" : "shadow-red-200"
                          } w-full p-3 rounded-md shadow-md`}
                        />
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
                            validPassword
                              ? "shadow-green-200"
                              : "shadow-red-200"
                          } w-full p-3 my-2 rounded-md shadow-md`}
                        />
                        <button
                          type="submit"
                          className="px-3 py-2 rounded-md shadow-md bg-gradient-to-tr from-green-200 to-green-300 w-full mt-4"
                        >
                          Login
                        </button>
                      </motion.form>
                    )}
                  </AnimatePresence>
                  <AnimatePresence>
                    {!regularLogin && (
                      <motion.div
                        initial={{ opacity: 0, y: "100%" }}
                        exit={{ opacity: 0, y: "100%", position: "absolute" }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          transition: { delay: 0.25 },
                        }}
                      >
                        <button
                          onClick={() => loginGoogle()}
                          className="px-5 py-2 my-2 w-full font-bold rounded-md shadow-md text-white google"
                        >
                          {loginLoading ? <p>Loadin...</p> : <p>Google</p>}
                        </button>
                        <button
                          // onClick={() => {
                          // setLoginLoading(true);
                          // loginFacebook();
                          // }}
                          className="px-5 py-2 my-2 w-full font-bold rounded-md shadow-md text-white facebook opacity-50"
                        >
                          Facebook
                        </button>
                        <button
                          // onClick={() => {
                          // setLoginLoading(true);
                          // loginFacebook();
                          // }}
                          className="px-5 py-2 my-2 w-full font-bold rounded-md shadow-md text-white discord opacity-50"
                        >
                          Discord
                        </button>
                        <button
                          // onClick={() => {
                          //   setLoginLoading(true);
                          //   loginGithub();
                          // }}
                          className="px-5 py-2 my-2 w-full font-bold rounded-md shadow-md text-white github opacity-50"
                        >
                          Github
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default LoginLogout;
