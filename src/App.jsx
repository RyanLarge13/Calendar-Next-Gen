import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatesProvider } from "./context/DatesContext";
import Calendar from "./components/Calendar";
import Header from "./components/Header";

const App = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatesProvider>
        <Header />
        <div className="overflow-x-hidden w-full h-full">
          <Calendar />
        </div>
      </DatesProvider>
    </LocalizationProvider>
  );
};

export default App;
