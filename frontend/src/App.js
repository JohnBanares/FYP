import {BrowserRouter, Routes, Route} from 'react-router-dom'

import Home from './pages/Home'
import Review from './pages/Review'
import Login from './pages/Login'
import SignUp from './pages/Signup'

function App() {
  return (
    <div className="App">
      
      <BrowserRouter>
      <div className='pages'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/review" element={<Review />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />


        </Routes>
      </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
