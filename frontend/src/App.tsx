import CheckIn from './screens/CheckIn'
import { useState } from 'react'
import { useEffect } from 'react'
import BodyFigure from './components/BodyFigure'
import { mockStatus } from './mocks/status'
import './App.css'



function App() {
  const [status, setStatus] = useState<string>("checking...")


  useEffect(() => {
        fetch("http://localhost:8080/api/health")
        .then(r => r.json())
        .then(data => setStatus(data.status))
        .catch(()=> setStatus("backend unreachable"))
      },[])
  return (
    <>
      <section id="center">
        <div>
          <h1>backend: {status}</h1>
          <CheckIn />
          <BodyFigure status={mockStatus} />
          <p>
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        
      </section>

    </>
  )
}

export default App
