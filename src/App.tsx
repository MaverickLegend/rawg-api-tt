import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { Router } from "./routes/Router";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <BrowserRouter>
        <Toaster position="top-center" />
        <Router />
      </BrowserRouter>
    </>
  );
}

export default App;
