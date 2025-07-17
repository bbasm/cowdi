import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Tentang from "./pages/Tentang";
import Faqs from "./pages/Faqs";
import Footer from "./pages/Footer";
import MulaiCoding from "./pages/MulaiCoding";
import LessonRenderer from "./components/LessonRenderer";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <section id="home">
                <Home />
              </section>
              <section id="tentang">
                <Tentang />
              </section>
              <section id="faqs">
                <Faqs />
              </section>
            </>
          }
        />
        <Route path="/mulaicoding" element={<MulaiCoding />} />

        <Route path="/mulaicoding/:lessonNumber?" element={<MulaiCoding />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
