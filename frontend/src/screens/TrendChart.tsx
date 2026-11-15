import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { mockMeasurements } from "../mocks/measurements";
import { useState } from "react";
import { mockIndicators } from "../mocks/indicators";

function TrendChart() {
    const [indicatorId, setIndicatorId] = useState(1); // heart rate for now, a dropdown comes in step 2

    // 1. Keep only the measurements for this indicator
    const chartData = mockMeasurements
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
                {mockIndicators.map((indicator) => (
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