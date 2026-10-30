import FacebookLogin from "@greatsumini/react-facebook-login";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion";
import { useContext } from "react";
import InteractiveContext from "../../../context/InteractiveContext.jsx";
import UserContext from "../../../context/UserContext.jsx";
import { loginWithFb } from "../../../utils/api.js";
import UsernamePassLogin from "./UsernamePassLogin.jsx";

const SocialLoginContent = () => {
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
      initial={{ opacity: 0, y: 10 }}
      exit={{ opacity: 0, y: 10, position: "absolute" }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { delay: 0.25 },
      }}
      className="flex flex-col gap-8 min-h-full overflow-y-auto px-5 py-10 sm:px-8 max-w-lg mx-auto"
    >
      <button
        onClick={() => setShowLogin(false)}
        className="self-end rounded-xl border border-[var(--calendar-border)] px-4 py-2 text-xs font-semibold calendar-accent hover:bg-amber-50"
      >
        Cancel
      </button>

      <div>
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.3em] calendar-accent font-bold">
            Welcome back
          </p>
          <h1 className="text-3xl mt-3 font-semibold tracking-tight">
            Your day, beautifully organized.
          </h1>
          <p className="text-sm mt-3 opacity-65">
            Sign in or create an account to keep everything in sync.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 w-full">
          <button
            onClick={() => loginGoogle()}
            className="calendar-action px-4 py-3 w-full font-semibold shadow-sm hover:shadow-md"
          >
            <p>Google</p>
          </button>
          <FacebookLogin
            appId={fbId}
            className="calendar-action px-4 py-3 w-full font-semibold shadow-sm hover:shadow-md"
            children="Facebook"
            scope="email, public_profile"
            callback={loginFb}
          />
        </div>
      </div>
      <div className="flex items-center gap-4 text-xs opacity-60">
        <div className="h-px flex-1 bg-[var(--calendar-border)]" />
        <span>OR CONTINUE WITH EMAIL</span>
        <div className="h-px flex-1 bg-[var(--calendar-border)]" />
      </div>
      <UsernamePassLogin />
    </motion.div>
  );
};

const SocialLogin = () => (
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <SocialLoginContent />
  </GoogleOAuthProvider>
);

export default SocialLogin;
