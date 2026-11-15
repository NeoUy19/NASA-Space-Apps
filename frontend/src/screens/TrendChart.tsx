import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import type { Indicator, Measurement } from "../types";


function TrendChart({ crewId, refreshKey }: { crewId: number; refreshKey: number }) {
    const [indicatorId, setIndicatorId] = useState(1); // heart rate for now, a dropdown comes in step 2
    const [indicators, setIndicators] = useState<Indicator[]>([])
    const [measurements, setMeasurements] = useState<Measurement[]>([])
    
    // This person's readings for the chosen indicator. Reruns when the crew member,
    // the indicator, or a new check-in (refreshKey) changes.
    useEffect(() => {
        fetch(`http://localhost:8080/api/crew/${crewId}/measurements?indicator=${indicatorId}`)
        .then(r => r.json())
        .then(data => setMeasurements(data))
        .catch(() => setMeasurements([]))
    }, [crewId, indicatorId, refreshKey])

    // The indicator list for the dropdown. Only needed once.
    useEffect(() => {
        fetch("http://localhost:8080/api/indicators")
        .then(r => r.json())
        .then(data => setIndicators(data))
        .catch(() => setIndicators([]))
    }, [])
      
    // 1. Keep only the measurements for this indicator
    const chartData = measurements
        .filter((m) => m.indicatorId === indicatorId)
        .map((m) => ({
            date: new Date(m.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            value: m.value
        }));

    return (
        <div>
            <p>Simulated data</p>
            <h2>Trends</h2>
            <select value={indicatorId} onChange={(e) => setIndicatorId(Number(e.target.value))}>
                {indicators.map((indicator) => (
                    <option key={indicator.id} value={indicator.id}>
                        {indicator.name} ({indicator.unit})
                    </option>
                ))}
            </select>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" interval={0}/>
                    <YAxis domain={["auto", "auto"]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default TrendChart;