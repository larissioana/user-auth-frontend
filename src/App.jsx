import { useState } from 'react'
import './App.css'
import Auth from './components/auth/Auth';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProfilePage from './components/profilePage/ProfilePage';

function App() {
  const [auth, setAuth] = useState("register");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth auth={auth} setAuth={setAuth} />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
