import {BrowserRouter, Routes, Route} from 'react-router-dom'

import Home from './pages/Home'
import Review from './pages/Review'

function App() {
  return (
    <div className="App">
      
      <BrowserRouter>
      <div className='pages'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/review" element={<Review />} />
        </Routes>
      </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
