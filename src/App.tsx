import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MyNavbar from './components/Navbar';
import Home from "./Pages/Home";
import Exercises2 from './Pages/Exercises2';
import Workouts from './Pages/Your-Workouts';
import Tools from './Pages/Tools';

function App() {
  return (
    <Router>
      <MyNavbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/exercises" element={<Exercises2 />} />
          <Route path="/Workouts" element={<Workouts />} />
          <Route path="/tools" element={<Tools />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
