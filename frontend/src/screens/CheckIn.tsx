import { useState } from "react";
import { mockIndicators } from "../mocks/indicators";
import type { NewMeasurement } from "../types";

function CheckIn() {
    const [values, setValues] = useState<Record<number, string>>({}); // key is indicatorId, value is the input value
    function handleSubmit() {
        const measurements: NewMeasurement[] = Object.entries(values)   //Turns the values into a list of pairs
            .filter(([_, value]) => value !== "") // gets rid of any box that the user left empty
            .map(([id,value]) => ({       // Turns each paur into a NewMeasurement,follows the contract for POST /api/measurements
                crewMemberId: 1, // hardcoded for now
                indicatorId: Number(id),
                value: Number(value),
            }));
            console.log(measurements);
        }
    return (
        <div>
            <p> Simulated data</p>
            <h2>Daily check-in</h2>
            {mockIndicators.map((indicator) => (
                <div key={indicator.id}>
                    <h3>{indicator.name} {indicator.unit}</h3>
                    <p>{indicator.howToMeasure}</p>
                    <input
                        type="number"
                        value={values[indicator.id] || ""}
                        onChange={(e) => setValues({ ...values, [indicator.id]: e.target.value })}
                    />
                </div>
            ))}
            <button onClick={handleSubmit}>Submit check-in</button>
            <pre>{JSON.stringify(values)}</pre>
        </div>
    );
}

export default CheckIn;