import { BrowserRouter, Route, Routes } from "react-router-dom";

import { ScrollToHash } from "@/components/ScrollToHash";
import { ProcessProvider } from "@/store/ProcessStore";
import CreateTask from "./pages/CreateTask";
import Dashboard from "./pages/Dashboard";
import HeroV1 from "./pages/HeroV1";
import HeroV2 from "./pages/HeroV2";
import History from "./pages/History";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import ProcessDetail from "./pages/ProcessDetail";
import Templates from "./pages/Templates";

export default function App() {
  return (
    // BASE_URL is "/" locally and "/<repo>/" on a GitHub Pages project site.
    // Trailing slash is stripped: react-router wants "/aiyo-web", not "/aiyo-web/".
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <ProcessProvider>
        <ScrollToHash />
        <Routes>
          {/* Marketing site */}
          <Route path="/" element={<Landing />} />

          {/* Web app */}
          <Route path="/app" element={<Dashboard />} />
          <Route path="/app/create" element={<CreateTask />} />
          <Route path="/app/process/:id" element={<ProcessDetail />} />
          <Route path="/app/templates" element={<Templates />} />
          <Route path="/app/history" element={<History />} />

          {/* Earlier hero explorations, kept for side-by-side comparison. */}
          <Route path="/hero-v1" element={<HeroV1 />} />
          <Route path="/hero-v2" element={<HeroV2 />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </ProcessProvider>
    </BrowserRouter>
  );
}
