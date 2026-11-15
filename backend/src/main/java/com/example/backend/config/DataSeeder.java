package com.example.backend.config;

import com.example.backend.model.BodySystem;
import com.example.backend.model.CrewMember;
import com.example.backend.model.IndicatorDefinition;
import com.example.backend.repository.CrewMemberRepository;
import com.example.backend.repository.IndicatorDefinitionRepository;
import com.example.backend.repository.MeasurementRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(1)
public class DataSeeder implements CommandLineRunner {

    private final CrewMemberRepository crewMemberRepository;
    private final IndicatorDefinitionRepository indicatorRepository;
    private final MeasurementRepository measurementRepository;

    public DataSeeder(CrewMemberRepository crewMemberRepository,
                      IndicatorDefinitionRepository indicatorRepository,
                      MeasurementRepository measurementRepository) {
        this.crewMemberRepository = crewMemberRepository;
        this.indicatorRepository = indicatorRepository;
        this.measurementRepository = measurementRepository;
    }

    @Override
    public void run(String... args) {
        // 1. TODO: create 2 or 3 simulated crew members and save them
        crewMemberRepository.save(new CrewMember("Neo Uy", "Pawn"));
        crewMemberRepository.save(new CrewMember("Carl Doldolea", "God"));
        crewMemberRepository.save(new CrewMember("Adi Latic", "Pawn"));
        // 2. TODO: create the 7 indicators from docs/health-content.md and save them
        indicatorRepository.save(new IndicatorDefinition(
                "Heart rate",
                "bpm",
                BodySystem.CARDIOVASCULAR,
                null, null,          // normalMin, normalMax: no source yet
                null, null,          // cautionMin, cautionMax: no source yet
                "Sit or rest quietly for 5 minutes. Use the pulse sensor or count beats at the wrist for 30 seconds and multiply by 2. Measure at the same time each day.",
                "Fluids shift toward the head in weightlessness, and the body adjusts how it controls the heart. NASA found heart rate and its daily ups and downs are lower in flight. A big jump from your own baseline can be an early sign of stress, illness, or deconditioning.",
                "Cardiovascular deconditioning; fast heart rate (tachycardia) after returning to gravity.",
                "https://ntrs.nasa.gov/citations/20040201532 ; https://core.ac.uk/works/15260545"
        ));
        indicatorRepository.save(new IndicatorDefinition(
                "Systolic Blood Pressure",
                "mmHg",
                BodySystem.CARDIOVASCULAR,
                null, null,          // normalMin, normalMax: no source yet
                null, null,          // cautionMin, cautionMax: no source yet
                "Sit still for 5 minutes with your arm supported at heart level. Put the cuff on your bare upper arm and stay still and quiet while it reads. Measure at the same time each day.",
                "A NASA-funded study of astronauts on 6-month missions found 24-hour systolic pressure dropped in space (about 120 mmHg before flight to about 106 mmHg in flight) and went back to normal after landing. The bigger risk is returning to gravity: astronauts can have trouble keeping their blood pressure up when they stand.",
                "Orthostatic intolerance (dizziness or fainting when standing) after returning to gravity, for example on Mars.",
                "https://doi.org/10.1161/CIRCULATIONAHA.119.041050 ; https://ntrs.nasa.gov/api/citations/20150007319/downloads/20150007319.pdf"
        ));
        indicatorRepository.save(new IndicatorDefinition(
                "Diastolic Blood Pressure",
                "mmHg",
                BodySystem.CARDIOVASCULAR,
                null, null,          // normalMin, normalMax: no source yet
                null, null,          // cautionMin, cautionMax: no source yet
                "Same reading as systolic. The cuff gives both numbers (systolic is the top number, diastolic is the bottom one).",
                "Studies differ. The Shuttle-era NASA study found diastolic pressure was lower in flight, while the 6-month ISS study found it unchanged. Either way, a change from your own baseline is the thing to watch.",
                "Cardiovascular deconditioning; orthostatic intolerance after returning to gravity.",
                "https://ntrs.nasa.gov/citations/20040201532 ; https://doi.org/10.1161/CIRCULATIONAHA.119.041050"
        ));
        indicatorRepository.save(new IndicatorDefinition(
                "SpO2 (blood oxygen)",
                "%",
                BodySystem.RESPIRATORY,
                null, null,          // normalMin, normalMax: no source yet
                null, null,          // cautionMin, cautionMax: no source yet
                "Sit still and clip the pulse oximeter on a fingertip. Keep your hand still and warm. Wait until the number stops changing (about 30 seconds), then record it.",
                "Oxygen keeps your body's tissues working. Low oxygen (hypoxia) can affect mood, senses, thinking and coordination. It's easy to miss, because the symptoms can feel like normal tiredness, and it can make it harder to notice you have a problem.",
                "Hypoxia from a cabin atmosphere or life-support problem.",
                "https://www.nasa.gov/wp-content/uploads/2023/12/ochmo-tb-003-habitable-atmosphere.pdf"
        ));
        indicatorRepository.save(new IndicatorDefinition(
                "Body Temperature",
                "°C",
                //TBD we can discuss what body system it is
                BodySystem.THERMOREGULATION,
                null, null,          // normalMin, normalMax: no source yet
                null, null,          // cautionMin, cautionMax: no source yet
                "Rest for 10 minutes first, and don't measure right after exercise. Use the forehead or oral thermometer the same way and at the same time each day.",
                "A study of astronauts on the ISS (with NASA Johnson Space Center co-authors) found resting core body temperature slowly rose by about 1 °C over 2.5 months in space, to around 38 °C. During exercise it rose higher and faster than on Earth, sometimes above 40 °C. Even small increases can hurt physical and mental performance.",
                "Heat buildup in weightlessness (no natural airflow to carry heat away); infection.",
                "https://doi.org/10.1038/s41598-017-15560-w"
        ));
        indicatorRepository.save(new IndicatorDefinition(
                "Sleep Duration",
                "hours",
                BodySystem.SLEEP,
                null, null,          // normalMin, normalMax: no source yet
                null, null,          // cautionMin, cautionMax: no source yet
                "When you wake up, enter about how many hours you actually slept (not just time in bed). If you wear a sleep tracker, use its number.",
                "NASA studies show astronauts often sleep less in space than on the ground, around 6 to 6.5 hours a night on the Shuttle and ISS." +
                        " Sleep studies cited by NASA found that after 7 days of 6 hours of sleep," +
                        " a person performs about as badly as someone who has been awake for 24 to 36 hours straight.",
                "Fatigue and performance errors from sleep loss, circadian disruption (no normal day/night cycle) and work overload.",
                "https://www.nasa.gov/wp-content/uploads/2023/03/sleep-accomodations-technical-brief-ochmo.pdf " +
                        "; https://ntrs.nasa.gov/citations/20230003916"
        ));
        indicatorRepository.save(new IndicatorDefinition(
                "Mood",
                "Scale",
                BodySystem.BEHAVIORAL,
                null, null,          // normalMin, normalMax: no source yet
                null, null,          // cautionMin, cautionMax: no source yet
                "Once a day, at the same time, pick the number that best matches how you've felt overall today.",
                "Isolation, confinement, distance from Earth and stress can affect mood, morale, thinking and teamwork. NASA notes astronauts can be reluctant to report these problems, and 2 of 7 NASA Shuttle-Mir astronauts reported depressive symptoms. NASA is working on semi-autonomous behavioral health monitoring for future missions, which is what this app's daily check-in does in a simple way.",
                "Adverse cognitive or behavioral conditions from isolation and confinement.",
                "https://www.nasa.gov/wp-content/uploads/2023/12/ochmo-tb-016-behavioral-health.pdf ; https://www.nasa.gov/wp-content/uploads/2023/12/ochmo-tb-014-behavioral-health-mishaps.pdf ; " +
                        "https://ntrs.nasa.gov/api/citations/20260002656/downloads/HRP%20IWS%202026%20HFBP%20Overview%20export%20control%20042026.pdf"
        ));

        // 3. TODO (later): about 2 weeks of simulated measurements
    }
}