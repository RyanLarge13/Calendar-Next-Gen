import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { DatesProvider } from "./context/DatesContext";
import { InteractiveProvider } from "./context/InteractiveContext";
import { UserProvider } from "./context/UserContext";
import Calendar from "./components/Calendar";
import Header from "./components/Header";
import Search from "./components/Search";
import SystemNotif from "./components/SystemNotif";
import Stickies from "./components/Stickies"
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
              <Search />
              <SystemNotif />
              <Stickies />
              <div className="overflow-hidden w-full h-full">
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
