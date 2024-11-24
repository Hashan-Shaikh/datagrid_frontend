import DataGrid from "./DataGrid/DataGrid";
import Details from "./DataGrid/Details";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<DataGrid />} />
          <Route path="/details/:id" element={<Details />} />
      </Routes>
    </Router>
  );
}

export default App;
