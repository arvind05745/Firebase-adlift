import "./App.css";
import Home from "./Page/Home";
import Login from "./Page/Login";
import Signup from "./Page/Signup";
import AddItem from "./Page/AddItem";
import { BrowserRouter as Router } from "react-router-dom";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div>
        <section>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/add_item" element={<AddItem />} />
          </Routes>
        </section>
      </div>
    </Router>
  );
}

export default App;
