import React from 'react'
import { BrowserRouter as Router,Routes,Route,Navigate } from 'react-router-dom'
import Login from "./pages/Auth/Login"
import Signup from './pages/Auth/Signup'
import Home from './pages/Home/Home'

function App() {
  return (
    <>
    <div>
      <Router>
        <Routes>
        <Route path="/" exaxt element={<Root/>}/>
          <Route path="/dashboard" exaxt element={<Home/>}/>
          <Route path="/login" exaxt element={<Login/>}/>
          <Route path="/signup" exaxt element={<Signup/>}/>
        </Routes>
      </Router>
    </div>
    
    </>
  )
}
// Define the Root component to handle the initial redirect
const Root = () => {
  // Check if token exists in localStorage
  const isAuthenticated = !!localStorage.getItem("token");

  // Redirect to dashboard if authenticated, otherwise to login
  return isAuthenticated ? (
      <Navigate to="/dashboard" />
  ) : (
      <Navigate to="/login" />
  );
};


export default App
