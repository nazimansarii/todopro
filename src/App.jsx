import { Outlet } from "react-router";
import "./App.css";
import { Navigation } from "./components/Navigation";
import ThemeProvider from "./context/ThemeContext";


function App() {

  return (

    <ThemeProvider>
      <main className="flex  max-w-[1500px] mx-auto">
        <Navigation />

        <Outlet />
      </main>
    </ThemeProvider>

  );
}

export default App;
