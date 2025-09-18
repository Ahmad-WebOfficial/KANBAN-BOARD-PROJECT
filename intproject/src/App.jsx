import React from 'react';
import { useState } from 'react';
import Dashboard from "./components/Dashboard"
import Hero from "./components/Hero"

function App() {
  const [islogin,setLogin]=useState(false)
  return (
    <div>

      {islogin ? <Dashboard/>:<Hero/>}
    </div>
  );
}

export default App;
