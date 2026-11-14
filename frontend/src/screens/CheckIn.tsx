import { useState } from "react";
import { mockIndicators } from "../mocks/indicators";
import type { NewMeasurement } from "../types";


const inputLimits: Record<number, { min: number; max?: number }> = {
    4: { min: 0, max: 100 }, // SpO2 is a %
    6: { min: 0, max: 24 }, // Sleep duration is in hours
    7: { min: 1, max: 5 }, // Mood is on a scale of 1-5
};

function CheckIn() {
    const [values, setValues] = useState<Record<number, string>>({}); // key is indicatorId, value is the input value
    const [error, setError] = useState("");     // State to hold error messages
    const [saved, setSaved] = useState(false); // State to indicate if the check-in was saved successfully
    function handleSubmit() {       //Handle the submit button click
        const measurements: NewMeasurement[] = Object.entries(values)   //Turns the values into a list of pairs
            .filter(([, value]) => value !== "") // gets rid of any box that the user left empty
            .map(([id,value]) => ({       // Turns each paur into a NewMeasurement,follows the contract for POST /api/measurements
                crewMemberId: 1, // hardcoded for now
                indicatorId: Number(id),
                value: Number(value),
            }));
            for (const measurement of measurements) {       // Goes through each measurement and checks if the value is negative. If it is, sets an error message and returns early
                const limit = inputLimits[measurement.indicatorId];
                const name = mockIndicators.find(indicator => indicator.id === measurement.indicatorId)?.name;        //Finds which indicator is wrong
                if (limit && (measurement.value < limit.min || (limit.max !== undefined && measurement.value > limit.max))) {
                    setError(`${name} must be between ${limit.min} and ${limit.max}.`);
                    return;
                } else if (measurement.value < 0) {
                    setError(`${name} cannot be negative.`);
                    return;
                }
            }
            setError("");       // If all values are valid, clear any previous error messages
            console.log(measurements);
            setSaved(true);
        }
    return (
        <div>
            <p> Simulated data</p>
            <h2>Daily check-in</h2>
            {mockIndicators.map((indicator) => (
                <div key={indicator.id}>
                    <h3>{indicator.name} ({indicator.unit})</h3>
                    <p>{indicator.howToMeasure}</p>
                    <input
                        type="number"
                        value={values[indicator.id] || ""}
                        onChange={(e) => {
                            setValues({ ...values, [indicator.id]: e.target.value });
                            setError("");
                            setSaved(false);
                        }}
                    />
                </div>
            ))}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {saved && <p style={{ color: "green" }}>Check-in saved successfully!</p>}
            <button onClick={handleSubmit}>Submit check-in</button>
        </div>
    );
}

export default CheckIn;