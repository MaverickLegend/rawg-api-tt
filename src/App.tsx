import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { Router } from "./routes/Router";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br bg-base-200 text-white">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <BrowserRouter>
          <Toaster position="top-center" />
          <Router />
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
