import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Chat from './components/chatComponent/Chat.tsx'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="" element={<Chat />} />
      </Routes>
    </Router>
  )
}

export default App
