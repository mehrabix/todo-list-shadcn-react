
import Home from '@/app/'
import DescriptionPage from '@/app/Description'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import Layout from './Layout'

function App() {

  return (
    <Router>
   
        <Layout />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/description" element={<DescriptionPage />} />
      </Routes>
    </Router>

  )
}

export default App
