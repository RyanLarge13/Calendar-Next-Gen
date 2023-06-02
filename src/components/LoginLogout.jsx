import { useContext, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useGoogleLogin } from "@react-oauth/google";
import { BiLogInCircle, BiLogOutCircle } from "react-icons/bi";
import { BsFillBellFill } from "react-icons/bs";
import { loginWithPasswordAndUsername } from "../utils/api";
import UserContext from "../context/UserContext";
import InteractiveContext from "../context/InteractiveContext";
import Notification from "./Notification";

const LoginLogout = () => {
  const { showLogin, setShowLogin, notifications} = useContext(InteractiveContext);
  const {
    user,
    setUser,
    setGoogleToken,
    loginLoading,
    setLoginLoading,
    setAuthToken,
    setEvents,
    events,
  } = useContext(UserContext);

  const [regularLogin, setRegularLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showNotifs, setShowNotifs] = useState(false);
  const [unReadLength, setUnReadLength] = useState(0);

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

  const loginPasswordUsername = (e) => {
    e.preventDefault();
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
  };

  return (
    <>
      {showNotifs && <Notification />}
      {showLogin && (
        <div
          onClick={() => setShowLogin(false)}
          className="fixed inset-0 bg-[rgba(0,0,0,0.4)] z-10"
        ></div>
      )}
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="p-3 fixed bottom-0 left-0 right-0 rounded-md shadow-md bg-white z-10"
      >
        {user ? (
          <div className="">
            <div className="flex justify-between items-center bg-purple-100 rounded-md shadow-md p-2 mb-5">
              <BiLogOutCircle
                onClick={() => logout()}
                className="text-xl abolute left-2 top-2"
              />
              <div
                onClick={() => setShowNotifs((prev) => !prev)}
                className="relative"
              >
                {unReadLength > 0 && (
                  <div
                    className={`absolute top-[-5px] right-[-5px] rounded-full w-[10px] h-[10px] bg-red-400`}
                  >
                    {unReadLength}
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
              <p>{user.email}</p>
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
            {regularLogin ? (
              <motion.form
                initial={{ opacity: 0, y: "100%" }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={loginPasswordUsername}
                className="w-full flex flex-col items-center justify-center"
              >
                <input
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  placeholder="Username"
                  value={username}
                  id="username"
                  name="username"
                  className="w-full p-3 rounded-md shadow-md"
                />
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Email"
                  value={email}
                  id="email"
                  name="email"
                  className="w-full p-3 my-2 rounded-md shadow-md"
                />
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Password"
                  value={password}
                  id="password"
                  name="password"
                  className="w-full p-3 rounded-md shadow-md"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-md shadow-md bg-gradient-to-tr from-green-200 to-green-300 w-full mt-5"
                >
                  Login
                </button>
              </motion.form>
            ) : (
              <>
                <button
                  onClick={() => loginGoogle()}
                  className="px-5 py-2 m-2 w-full font-bold rounded-md shadow-md text-white google"
                >
                  {loginLoading ? <p>Loadin...</p> : <p>Google</p>}
                </button>
                <button
                  // onClick={() => {
                  // setLoginLoading(true);
                  // loginFacebook();
                  // }}
                  className="px-5 py-2 m-2 w-full font-bold rounded-md shadow-md text-white facebook opacity-50"
                >
                  Facebook
                </button>
                <button
                  // onClick={() => {
                  //   setLoginLoading(true);
                  //   loginGithub();
                  // }}
                  className="px-5 py-2 m-2 w-full font-bold rounded-md shadow-md text-white github opacity-50"
                >
                  Github
                </button>
              </>
            )}
          </div>
        )}
      </motion.div>
    </>
  );
};

export default LoginLogout;
