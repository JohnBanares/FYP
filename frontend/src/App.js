import {BrowserRouter, Routes, Route} from 'react-router-dom'

import Home from './pages/Home'
import Review from './pages/Review'
import Login from './pages/Login'
import SignUp from './pages/Signup'
import Profile from './pages/Profile'

function App() {
  return (
    <div className="App">
      
      <BrowserRouter>
      <div className='pages'>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/review" element={<Review />} />
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
