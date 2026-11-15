import type { StatusResponse } from '../types';
import StatusBadge from '../components/StatusBadge';
import { SYSTEM_LABELS } from '../theme';


const actions: Record<string, string> = {
    SELF_CARE: "Keep monitoring and check in again tomorrow.",
    CREW_MEDICAL_OFFICER: "Tell your CMO today",
    FLIGHT_SURGEON: "Contact the flight surgeons on the ground",
};

const severity: Record<string, number> = {
    NORMAL: 0,
    CAUTION: 1,
    ALERT: 2,
};


function Guidance({ status }: {status: StatusResponse}) {       //This function determines what guidance to give the user based on their health status. It filters out any body systems that have no data and displays the status, reason, and recommended action for each system.
    return (
        <div className="guidance">
            <p className="sim-tag">Simulated data</p>
            <h2>Guidance</h2>
            <p className="note">This is decision support, not a diagnosis.</p>
            <ul>
                {status.bodySystems
                    .filter((system) => system.status !== "NO_DATA")
                    .sort((a,b) => severity[b.status] - severity[a.status])
                    .map((system) => (
                        <li key={system.bodySystem} className="guidance-item" data-status={system.status}>
                            <strong>{SYSTEM_LABELS[system.bodySystem]}</strong>
                            <StatusBadge status={system.status} />
                            <p>{system.reason}</p>
                            <p className="action">{actions[system.escalationLevel ?? ""]}</p> 
                              {system.recommendedAction && <p>{system.recommendedAction}</p>}    
                        </li>
                    ))}
            </ul>
        </div>
    );
}

export default Guidance;