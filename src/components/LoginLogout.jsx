import { useContext } from "react";
import { motion } from "framer-motion";
import { useGoogleLogin } from "@react-oauth/google";
import UserContext from "../context/UserContext";

const LoginLogout = () => {
  const { user, setGoogleToken, loginLoading, setLoginLoading } =
    useContext(UserContext);

  const loginGoogle = useGoogleLogin({
    onSuccess: (res) => {
      setGoogleToken(res.access_token);
      localStorage.setItem("googleToken", res.access_token);
    },
    onError: () => {
      setUser(false);
      setGoogleToken(false);
    },
  });

  const loginFacebook = () => {};

  const loginGithub = () => {};

  return (
    <>
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="p-3 fixed bottom-0 left-0 right-0 rounded-md shadow-md bg-white z-10"
      >
        {user ? (
          <p>User</p>
        ) : (
          <div className="flex flex-col justify-center items-center">
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
          </div>
        )}
      </motion.div>
    </>
  );
};

export default LoginLogout;
