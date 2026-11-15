import { useEffect, useState } from "react";
import BodyFigure from "../components/BodyFigure";
import type { StatusResponse } from "../types";

export default function StatusScreen({ crewId, refreshKey }: { crewId: number; refreshKey: number }) {
    const [status, setStatus]=useState<StatusResponse|null>(null)
    useEffect(() => {
        fetch(`http://localhost:8080/api/crew/${crewId}/status`)
        .then(r => r.json())
        .then(data => setStatus(data))
        .catch(()=> setStatus(null))
    }, [crewId, refreshKey]);   // rerun whenever crewId changes

    return (
        <div>
            {status ? <BodyFigure status = {status}/> : null} 
        </div>
    );
}
