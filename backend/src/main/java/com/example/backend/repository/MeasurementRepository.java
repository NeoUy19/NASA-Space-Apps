package com.example.backend.repository;

import com.example.backend.model.Measurement;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.time.Instant;

public interface MeasurementRepository extends JpaRepository<Measurement, Long> {
    List<Measurement> findByCrewMemberIdAndIndicatorIdAndTimestampAfterOrderByTimestampAsc(Long crewMemberId, Long indicatorId, Instant time);
    List<Measurement> findByCrewMemberIdOrderByTimestampAsc(Long crewMemberId);
}
