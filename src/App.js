import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import MyNav from './components/MyNav'
import Home from './components/Home'

function App() {
  return (
    <div>
      <header>
        <MyNav />
      </header>
      <main>
        <Home />
      </main>
    </div>
  )
}

export default App
