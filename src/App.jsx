import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { DatesProvider } from "./context/DatesContext";
import { InteractiveProvider } from "./context/InteractiveContext";
import { UserProvider } from "./context/UserContext";
import Calendar from "./components/Calendar";
import Header from "./components/Header";
import AddCircle from "./components/AddCircle";
import Views from "./components/Views";

const App = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <UserProvider>
          <DatesProvider>
            <InteractiveProvider>
              <Header />
              <div className="overflow-x-hidden w-full h-full">
                <Calendar />
              </div>
              <AddCircle />
              <Views />
            </InteractiveProvider>
          </DatesProvider>
        </UserProvider>
      </GoogleOAuthProvider>
    </LocalizationProvider>
  );
};

export default App;
