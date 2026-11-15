import CheckIn from './screens/CheckIn'
import Guidance from './screens/Guidance'
import { useState } from 'react'
import { useEffect } from 'react'
import './App.css'
import StatusScreen from './screens/StatusScreen'



function App() {
  const [status, setStatus] = useState<string>("checking...")
  const [crewId, setCrewId] = useState<number>(1)
  const [refreshKey, setRefreshKey] = useState<number>(0)

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
          <label >
              Crew member:{" "}
                <select value={crewId} onChange={(e) => setCrewId(Number(e.target.value))}>
                    <option value={1}>Crew member 1 (simulated)</option>
                    <option value={2}>Crew member 2 (simulated)</option>
                    <option value={3}>Crew member 3 (simulated)</option>
                </select>
            </label>
          <CheckIn crewId={crewId} onSaved={() => setRefreshKey(k => k + 1)} />
          <Guidance />
          <StatusScreen crewId={crewId} refreshKey={refreshKey} />
          <p>
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        
      </section>

    </>
  )
}

export default App
