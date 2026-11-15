import { mockStatus } from '../mocks/status';


const actions: Record<string, string> = {
    SELF_CARE: "Keep monitoring and check in again tomorrow.",
    CREW_MEDICAL_OFFICER: "Tell your CMO today",
    FLIGHT_SURGEON: "Contact the flight surgeons on the ground",
};

const statusColors: Record<string, string> = {
    NO_DATA: "gray",
    NORMAL: "green",
    CAUTION: "yellow",
    ALERT: "red",
};

const severity: Record<string, number> = {
    NORMAL: 0,
    CAUTION: 1,
    ALERT: 2,
};


function Guidance() {       //This function determines what guidance to give the user based on their health status. It filters out any body systems that have no data and displays the status, reason, and recommended action for each system.
    return (
        <div>
            <p>Simulated data</p>
            <h2>Guidance</h2>
            <p>This is decision support, not a diagnosis.</p>
            <ul>
                {mockStatus.bodySystems
                    .filter((system) => system.status !== "NO_DATA")
                    .sort((a,b) => severity[b.status] - severity[a.status])
                    .map((system) => (
                        <li key={system.bodySystem}>
                            <strong>{system.bodySystem}:</strong>{" "}
                            <span style={{ color: statusColors[system.status] }}>{system.status}</span>: {system.reason}
                            <p>{actions[system.escalationLevel ?? ""]}</p> 
                              {system.recommendedAction && <p>{system.recommendedAction}</p>}    
                        </li>
                    ))}
            </ul>
        </div>
    );
}

export default Guidance;