import MainApp from "./states/MainApp";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { DatesProvider } from "./context/DatesContext";
import { InteractiveProvider } from "./context/InteractiveContext";
import { UserProvider } from "./context/UserContext";

const App = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <UserProvider>
          <DatesProvider>
            <InteractiveProvider>
              <MainApp />
            </InteractiveProvider>
          </DatesProvider>
        </UserProvider>
      </GoogleOAuthProvider>
    </LocalizationProvider>
  );
};

export default App;
