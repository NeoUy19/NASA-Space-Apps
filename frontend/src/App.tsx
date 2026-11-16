// AI-assisted in part: written by the team; the page layout, tabs and header were added with Claude (Anthropic). See README, "Use of AI tools".
import CheckIn from './screens/CheckIn'
import TrendChart from './screens/TrendChart'
import Guidance from './screens/Guidance'
import CrewOverview from './screens/CrewOverview'
import { useState } from 'react'
import { useEffect } from 'react'
import './App.css'
import BodyFigure from './components/BodyFigure'
import StatusBadge from './components/StatusBadge'
import type { CrewMember, StatusResponse, Indicator } from './types'
import logo from './assets/logo.svg'

// The two pages. "health" is one crew member's dashboard, "crew" compares everyone.
type Page = "health" | "crew"

function App() {
  const [status, setStatus] = useState<string>("checking...")
  const [crewId, setCrewId] = useState<number>(1)
  const [refreshKey, setRefreshKey] = useState<number>(0)
  const [crewStatus, setCrewStatus]=useState<StatusResponse|null>(null)
  const [crew, setCrew] = useState<CrewMember[]>([])
  const [indicators, setIndicators] = useState<Indicator[]>([])
  // Start on the crew page if the address ends in #crew, so a reload keeps your place.
  const [page, setPage] = useState<Page>(window.location.hash === "#crew" ? "crew" : "health")

  useEffect(()=> {
    fetch(`http://localhost:8080/api/indicators`)
    .then(r=> r.json())
    .then(data => setIndicators(data))
    .catch(()=> setIndicators([]))
  })
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
  useEffect(() =>{
    fetch("http://localhost:8080/api/crew")
        .then(r => r.json())
        .then(data => setCrew(data))
        .catch(()=> setCrew([]))
  },[])

  function goTo(next: Page) {
    setPage(next)
    window.location.hash = next === "crew" ? "crew" : ""
  }

  // Turn the health check ("UP", "checking...", "backend unreachable") into the header pill.
  const systemState = status === "UP" ? "online" : status === "checking..." ? "checking" : "offline"

  return (
    <>
      <header className="app-header">
        <div className="brand">
          {/* Team logo. alt="" because the title next to it already names the app. */}
          <img className="brand-mark" src={logo} alt="" />
          <div>
            <h1>Astronaut Health Monitor</h1>
            <p>Onboard decision support</p>
          </div>
        </div>
        <span className="system-pill" data-state={systemState}>Onboard system: {systemState}</span>
      </header>

      <div className="toolbar">
        <nav className="tabs" aria-label="Pages">
          <button className="tab" aria-current={page === "health" ? "page" : undefined} onClick={() => goTo("health")}>My health</button>
          <button className="tab" aria-current={page === "crew" ? "page" : undefined} onClick={() => goTo("crew")}>Crew overview</button>
        </nav>
        {page === "health" && (
          <label className="crew-picker">
              Crew member:{" "}
                <select value={crewId} onChange={(e) => setCrewId(Number(e.target.value))}>
                    {crew.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}, {c.role} (simulated)</option>
                    ))}
                </select>
              {crewStatus && <StatusBadge status={crewStatus.overallStatus} />}
            </label>
        )}
      </div>

      {page === "health" ? (
        <main className="dashboard">
          <section className="card">
            <CheckIn crewId={crewId} onSaved={() => setRefreshKey(k => k + 1)} />
          </section>
          {crewStatus ? (
            <>
              <section className="card">
                <p className="sim-tag">Simulated data</p>
                <h2>Body status</h2>
                <BodyFigure status={crewStatus} indicators = {indicators} />
              </section>
              <section className="card">
                <Guidance status={crewStatus} />
              </section>
            </>
          ) : <p className="note">Loading...</p>}
          <section className="card wide">
            <TrendChart crewId={crewId} refreshKey={refreshKey} status={crewStatus} />
          </section>
        </main>
      ) : (
        <main>
          <CrewOverview
            crew={crew}
            refreshKey={refreshKey}
            onSelect={(id) => { setCrewId(id); goTo("health") }}
          />
        </main>
      )}
    </>
  )
}

export default App
