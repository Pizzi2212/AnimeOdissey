import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import MyNav from './components/MyNav'
import Home from './components/Home'
import List from './components/List'
import { FavoriteProvider } from './context/FavoriteProvider'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <FavoriteProvider>
      <Router>
        <header>
          <MyNav />
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/list" element={<List />} />
          </Routes>
        </main>
      </Router>
    </FavoriteProvider>
  )
}

export default App
