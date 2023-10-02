import { useContext } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { loginWithFb } from "../utils/api.js";
import { motion } from "framer-motion";
import FacebookLogin from "@greatsumini/react-facebook-login";
import UserContext from "../context/UserContext";

const SocialLogin = () => {
  const { setUser, setGoogleToken } = useContext(UserContext);

  const fbId = "1706883953149148";

  const loginGoogle = useGoogleLogin({
    scope: "https://www.googleapis.com/auth/calendar.events.readonly",
    onSuccess: (res) => {
      setGoogleToken(res.access_token);
    },
    onError: () => {
      setUser(false);
      setGoogleToken(false);
    },
  });

  const loginFb = async (response) => {
    if (response.accessToken) {
      try {
        loginWithFb(response.accessToken)
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
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
      className=""
    >
      <button
        onClick={() => loginGoogle()}
        className="px-5 py-2 my-2 w-full font-bold rounded-md shadow-md text-white google"
      >
        <p>Google</p>
      </button>
      <FacebookLogin
        appId={fbId}
        className="px-5 py-2 my-2 w-full font-bold rounded-md shadow-md text-white facebook"
        children="Facebook"
        scope="email, public_profile"
        callback={loginFb}
      />
      <button
        // onClick={() => {
        // loginFacebook();
        // }}
        className="px-5 py-2 my-2 w-full font-bold rounded-md shadow-md text-white discord opacity-50"
      >
        Discord
      </button>
      <button
        // onClick={() => {
        //   loginGithub();
        // }}
        className="px-5 py-2 my-2 w-full font-bold rounded-md shadow-md text-white github opacity-50"
      >
        Github
      </button>
      <button
        // onClick={() => {
        //   loginGithub();
        // }}
        className="px-5 py-2 my-2 w-full font-bold rounded-md shadow-md text-white apple opacity-50"
      >
        Twitter
      </button>
    </motion.div>
  );
};

export default SocialLogin;
