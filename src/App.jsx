import HomePage from "./HomePage/HomePage";
import GridPage from "./GridPage/GridPage";
import DetailsPage from "./DetailsPage/DetailsPage";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/grid" element={<GridPage />} />
          <Route path="/details/:id" element={<DetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
