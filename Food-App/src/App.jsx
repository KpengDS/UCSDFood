import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Families from "./pages/Families";
import Donors from "./pages/Donors";
import Volunteers from "./pages/Volunteers";
import Resources from "./pages/Resources";
import Inquiry from "./pages/Inquiry";
import PageNotFound from "./lib/PageNotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/families" element={<Families />} />
          <Route path="/donors" element={<Donors />} />
          <Route path="/volunteers" element={<Volunteers />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/inquiry" element={<Inquiry />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
