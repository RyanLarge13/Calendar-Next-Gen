import FacebookLogin from "@greatsumini/react-facebook-login";
import { useGoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion";
import { useContext } from "react";
import InteractiveContext from "../../context/InteractiveContext.jsx";
import UserContext from "../../context/UserContext.jsx";
import { loginWithFb } from "../../utils/api.js";
import UsernamePassLogin from "./UsernamePassLogin.jsx";

const SocialLogin = () => {
  const { setUser, setGoogleToken, setAuthToken } = useContext(UserContext);
  const { setShowLogin } = useContext(InteractiveContext);

  const fbId = import.meta.env.VITE_FB_ID;

  const loginGoogle = useGoogleLogin({
    scope: "https://www.googleapis.com/auth/calendar.events.readonly",
    onSuccess: (res) => {
      setGoogleToken(res.access_token);
    },
    onError: () => {
      setAuthToken(null);
      setUser(false);
      setGoogleToken(false);
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
    },
  });

  const loginFb = async (response) => {
    if (response.accessToken) {
      try {
        loginWithFb(response.accessToken)
          .then((res) => {
            setAuthToken(res.data.token);
            localStorage.setItem("authToken", res.data.token);
          })
          .catch((err) => {
            console.log(err);
            setAuthToken(null);
            setUser(false);
            localStorage.removeItem("user");
            localStorage.removeItem("authToken");
          });
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      exit={{ opacity: 0, y: 50, position: "absolute" }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { delay: 0.25 },
      }}
      className="flex flex-col justify-between min-h-screen overflow-y-auto p-10 px-12"
    >
      <button
        onClick={() => setShowLogin(false)}
        className="absolute top-5 left-3 rounded-lg border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition-all duration-200 hover:bg-red-100 hover:border-red-400 hover:scale-[0.97] active:scale-95 shadow-sm"
      >
        Cancel
      </button>

      <div>
        <p className="text-3xl mb-20 mt-10 text-center font-bold">
          Login Or Sign Up With
        </p>
        <div className="flex justify-center items-center gap-x-5 w-full">
          <button
            onClick={() => loginGoogle()}
            className="px-5 py-2 my-2 w-full font-bold rounded-md shadow-md text-white google duration-200 hover:shadow-lg hover:scale-[1.01]"
          >
            <p>Google</p>
          </button>
          <FacebookLogin
            appId={fbId}
            className="px-5 py-2 my-2 w-full font-bold rounded-md shadow-md text-white facebook duration-200 hover:shadow-lg hover:scale-[1.01]"
            children="Facebook"
            scope="email, public_profile"
            callback={loginFb}
          />
        </div>
      </div>
      <div className="text-center">
        <p>or</p>
        <div className="w-full h-1 rounded-full bg-slate-200 mt-2"></div>
      </div>
      <UsernamePassLogin />
    </motion.div>
  );
};

export default SocialLogin;
