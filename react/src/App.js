//Routing
import { HashRouter  as Router, Routes,  Route } from 'react-router-dom';

//Components

import POC from './components/POC';
 
//Styling 
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 


function App() {
  return (
    <Router>
        <Routes>
          <Route path='/' element={<POC/>} />
        </Routes>
    </Router> 
  );
}

export default App;
