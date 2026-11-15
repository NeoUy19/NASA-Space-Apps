import { useState, useEffect } from "react";
import type { NewMeasurement, Indicator } from "../types";

const inputLimits: Record<number, { min: number; max?: number }> = {
  4: { min: 0, max: 100 }, // SpO2 is a %
  6: { min: 0, max: 24 }, // Sleep duration is in hours
  7: { min: 1, max: 5 }, // Mood is on a scale of 1-5
};

function CheckIn({ crewId, onSaved }: { crewId: number; onSaved: () => void }) {
  const [values, setValues] = useState<Record<number, string>>({}); // key is indicatorId, value is the input value
  const [error, setError] = useState(""); // State to hold error messages
  const [saved, setSaved] = useState(false); // State to indicate if the check-in was saved successfully
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  useEffect(() => {
    fetch("http://localhost:8080/api/indicators")
      .then((r) => r.json())
      .then((data) => setIndicators(data));
  }, []);
  function handleSubmit() {
    //Handle the submit button click
    const measurements: NewMeasurement[] = Object.entries(values) //Turns the values into a list of pairs
      .filter(([, value]) => value !== "") // gets rid of any box that the user left empty
      .map(([id, value]) => ({
        // Turns each paur into a NewMeasurement,follows the contract for POST /api/measurements
        crewMemberId: Number(crewId), // hardcoded for now
        indicatorId: Number(id),
        value: Number(value),
      }));
    for (const measurement of measurements) {
      // Goes through each measurement and checks if the value is negative. If it is, sets an error message and returns early
      const limit = inputLimits[measurement.indicatorId];
      const name = indicators.find(
        (indicator) => indicator.id === measurement.indicatorId,
      )?.name; //Finds which indicator is wrong
      if (
        limit &&
        (measurement.value < limit.min ||
          (limit.max !== undefined && measurement.value > limit.max))
      ) {
        setError(`${name} must be between ${limit.min} and ${limit.max}.`);
        return;
      } else if (measurement.value < 0) {
        setError(`${name} cannot be negative.`);
        return;
      }
    }
    Promise.all(
      measurements.map((m) =>
        fetch("http://localhost:8080/api/measurements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(m), // m = one measurement
        }),
      ),
    )
      .then(() => {
        setValues({}); // Clear the input fields after submission
        setSaved(true);
        onSaved();
      })
      .catch(() => {
        setError("Couldn't save. Is the backend running?"); // If all values are valid, clear any previous error messages
      });
  }
  return (
    <div className="checkin">
      <p className="sim-tag">Simulated data</p>
      <h2>Daily check-in</h2>
      {indicators.map((indicator) => (
        <div key={indicator.id} className="field">
          <h3>
            {indicator.name} ({indicator.unit})
          </h3>
          <input
            type="number"
            aria-label={`${indicator.name} (${indicator.unit})`}
            value={values[indicator.id] || ""}
            onChange={(e) => {
              setValues({ ...values, [indicator.id]: e.target.value });
              setError("");
              setSaved(false);
            }}
          />
          <details>
            <summary>How to take this measurement</summary>
            <p>{indicator.howToMeasure}</p>
          </details>
        </div>
      ))}
      {error && <p className="msg-error">{error}</p>}
      {saved && <p className="msg-ok">Check-in saved successfully!</p>}
      <button onClick={handleSubmit}>Submit check-in</button>
    </div>
  );
}

export default CheckIn;
