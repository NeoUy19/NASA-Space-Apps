import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, ReferenceLine } from "recharts";
import { useState, useEffect } from "react";
import type { Indicator, Measurement, StatusResponse } from "../types";


function TrendChart({ crewId, refreshKey, status}  : { crewId: number; refreshKey: number; status: StatusResponse | null }) {
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

    const baseline = status?.bodySystems
    .flatMap((b) => b.indicators)
    .find((i) => i.indicatorId === indicatorId)?.baseline;

    return (
        <div className="trends">
            <p className="sim-tag">Simulated data</p>
            <h2>Trends</h2>
            <select value={indicatorId} onChange={(e) => setIndicatorId(Number(e.target.value))}>
                {indicators.map((indicator) => (
                    <option key={indicator.id} value={indicator.id}>
                        {indicator.name} ({indicator.unit})
                    </option>
                ))}
            </select>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData} margin={{ top: 8, right: 28, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#25345c" />
                    <XAxis dataKey="date" interval={0} stroke="#8b95a9" tick={{ fontSize: 12 }} />
                    <YAxis domain={["auto", "auto"]} stroke="#8b95a9" tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ background: "#0f1730", border: "1px solid #25345c", borderRadius: 8 }} labelStyle={{ color: "#eef3ff" }} />
                    <Line type="monotone" dataKey="value" stroke="#5cc8ff" strokeWidth={2} dot={{ r: 3 }} isAnimationActive={false} />
                    {baseline != null && (
                <ReferenceLine y={baseline} stroke="#b6c0d6" strokeDasharray="4 4" label={{ value: "your average", fill: "#b6c0d6", fontSize: 12, position: "insideTopLeft" }} />
)}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default TrendChart;