import { useEffect, useState } from "react";
import BodyFigure from "../components/BodyFigure";
import StatusBadge from "../components/StatusBadge";
import { SYSTEM_LABELS } from "../theme";
import type { CrewMember, Indicator, StatusResponse } from "../types";

/**
 * Everyone side by side: one column per crew member, one row per indicator.
 * Each cell shows that person's latest reading, its status, and their own usual value.
 */
function CrewOverview({ crew, refreshKey, onSelect }: {
  crew: CrewMember[];
  refreshKey: number;
  onSelect: (crewId: number) => void;   // "open this person's dashboard"
}) {
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  // One status per crew member, looked up by crew ID.
  const [statuses, setStatuses] = useState<Record<number, StatusResponse>>({});

  // The indicator list gives us the rows. Only needed once.
  useEffect(() => {
    fetch("http://localhost:8080/api/indicators")
      .then((r) => r.json())
      .then((data) => setIndicators(data))
      .catch(() => setIndicators([]));
  }, []);

  // Fetch every crew member's status at the same time, then store them by ID.
  useEffect(() => {
    Promise.all(
      crew.map((c) =>
        fetch(`http://localhost:8080/api/crew/${c.id}/status`).then((r) => r.json()),
      ),
    )
      .then((list: StatusResponse[]) => {
        const byId: Record<number, StatusResponse> = {};
        for (const s of list) {
          byId[s.crewMemberId] = s;
        }
        setStatuses(byId);
      })
      .catch(() => setStatuses({}));
  }, [crew, refreshKey]);

  // One person's result for one indicator, or undefined if they have no reading.
  function readingFor(crewId: number, indicatorId: number) {
    return statuses[crewId]?.bodySystems
      .flatMap((b) => b.indicators)
      .find((i) => i.indicatorId === indicatorId);
  }

  return (
    <section className="card">
      <p className="sim-tag">Simulated data</p>
      <h2>Crew overview</h2>
      <p className="note">
        Each reading is compared to that person's own usual value, not to the rest of the crew.
        Decision support only, not a diagnosis.
      </p>

      <div className="crew-table-wrap">
        <table className="crew-table">
          <thead>
            <tr>
              <th scope="col">Indicator</th>
              {crew.map((c) => {
                const status = statuses[c.id];
                return (
                  <th key={c.id} scope="col">
                    <div className="crew-col">
                      {status && <BodyFigure status={status} compact />}
                      <span className="name">{c.name}</span>
                      <small>{c.role}</small>
                      {status && <StatusBadge status={status.overallStatus} />}
                      <button onClick={() => onSelect(c.id)}>View details</button>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {indicators.map((indicator) => (
              <tr key={indicator.id}>
                <th scope="row">
                  {indicator.name}
                  <small>{SYSTEM_LABELS[indicator.bodySystem]}</small>
                </th>
                {crew.map((c) => {
                  const reading = readingFor(c.id, indicator.id);
                  if (!reading) {
                    return (
                      <td key={c.id} data-status="NO_DATA">
                        <StatusBadge status="NO_DATA" />
                      </td>
                    );
                  }
                  return (
                    <td key={c.id} data-status={reading.status}>
                      <span className="reading">
                        {reading.latestValue}
                        <span className="unit">{indicator.unit}</span>
                      </span>
                      <StatusBadge status={reading.status} />
                      <span className="usual">
                        {reading.baseline != null
                          ? `usual: ${reading.baseline.toFixed(1)}`
                          : "still building baseline"}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default CrewOverview;
