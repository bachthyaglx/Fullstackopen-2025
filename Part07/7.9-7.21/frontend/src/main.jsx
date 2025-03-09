import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import './index.css'; // Import Tailwind styles

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    {/* Wrap App inside BrowserRouter */}
    <App />
  </BrowserRouter>,
);
