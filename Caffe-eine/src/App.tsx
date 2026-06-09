import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppRoutes from "@/routes/index";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <AppRoutes />
    </BrowserRouter>
  );
}
