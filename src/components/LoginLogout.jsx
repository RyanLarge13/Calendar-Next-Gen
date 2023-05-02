import { useContext } from "react";
import { motion } from "framer-motion";
import { useGoogleLogin } from "@react-oauth/google";
import UserContext from "../context/UserContext";

const LoginLogout = () => {
  const {
    user,
    setToken,
    loginLoading,
    setLoginLoading,
    provider,
    setProvider,
  } = useContext(UserContext);

  const loginGoogle = useGoogleLogin({
    onSuccess: (res) => {
      setToken(res.access_token);
      // localstorage set item token
    },
    onError: () => {
      setUser(false);
      setToken(false);
    },
  });

  const loginFacebook = () => {};

  const loginGithub = () => {};

  return (
    <motion.div
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="p-3 fixed bottom-0 left-0 right-0 rounded-md shadow-md bg-white z-10"
    >
      {user ? (
        <p>User</p>
      ) : (
        <div className="flex flex-col justify-center items-center">
          <p>Welcome!!</p>
          <button
            onClick={() => {
              setProvider(() => "google");
              setLoginLoading(true);
              loginGoogle();
            }}
            className="px-5 py-2 my-2 rounded-md shadow-md text-white google"
          >
            Google
          </button>
          <button
            onClick={() => {
              setProvider(() => "facebook");
              setLoginLoading(true);
              loginFacebook();
            }}
            className="px-5 py-2 my-2 rounded-md shadow-md text-white facebook"
          >
            Facebook
          </button>
          <button
            onClick={() => {
              setProvider(() => "github");
              setLoginLoading(true);
              loginGithub();
            }}
            className="px-5 py-2 my-2 rounded-md shadow-md text-white github"
          >
            Github
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default LoginLogout;
