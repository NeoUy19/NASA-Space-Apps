import CheckIn from './screens/CheckIn'
import TrendChart from './screens/TrendChart'
import Guidance from './screens/Guidance'
import { useState } from 'react'
import { useEffect } from 'react'
import './App.css'
import BodyFigure from './components/BodyFigure'
import type { StatusResponse } from './types'



function App() {
  const [status, setStatus] = useState<string>("checking...")
  const [crewId, setCrewId] = useState<number>(1)
  const [refreshKey, setRefreshKey] = useState<number>(0)
  const [crewStatus, setCrewStatus]=useState<StatusResponse|null>(null)
  
  useEffect(() => {
          fetch(`http://localhost:8080/api/crew/${crewId}/status`)
          .then(r => r.json())
          .then(data => setCrewStatus(data))
          .catch(()=> setCrewStatus(null))
      }, [crewId, refreshKey]);   // rerun whenever crewId changes
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
            {crewStatus ?(
              <>
          <Guidance status={crewStatus} />
          <BodyFigure status={crewStatus} />
          </>
            ) : <p>Loading...</p>}
            <TrendChart crewId={crewId} refreshKey={refreshKey} />
          <p>
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        
      </section>

    </>
  )
}

export default App
