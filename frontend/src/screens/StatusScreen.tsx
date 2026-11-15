import { useEffect, useState } from "react";
import BodyFigure from "../components/BodyFigure";
import type { StatusResponse } from "../types";

export default function StatusScreen() {
    const [crewId, setCrewId] = useState<number>(1)
    const [status, setStatus]=useState<StatusResponse|null>(null)
    useEffect(() => {
        fetch(`http://localhost:8080/api/crew/${crewId}/status`)
        .then(r => r.json())
        .then(data => setStatus(data))
        .catch(()=> setStatus(null))
    }, [crewId]);   // rerun whenever crewId changes

    return (
        <div>
            <label>
                Crew member:{" "}
                <select value={crewId} onChange={(e) => setCrewId(Number(e.target.value))}>
                    <option value={1}>Crew member 1 (simulated)</option>
                    <option value={2}>Crew member 2 (simulated)</option>
                    <option value={3}>Crew member 3 (simulated)</option>
                </select>
            </label>
            {status ? <BodyFigure status = {status}/> : null} 
        </div>
    );
}
