package com.example.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.time.Instant;

@Entity
public class Measurement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "crew_member_id")
    private CrewMember crewMember;

    @ManyToOne(optional = false)
    @JoinColumn(name = "indicator_id")
    private IndicatorDefinition indicator;

    @Column(name = "measured_value")
    private Double value;

    @Column(name = "measured_at")
    private Instant timestamp;

    protected Measurement() { }

    public Measurement(CrewMember crewMember, IndicatorDefinition indicator,
                       Double value, Instant timestamp){
        this.crewMember = crewMember;
        this.indicator = indicator;
        this.value = value;
        this.timestamp = timestamp;
    }

    public CrewMember getCrewMember() {
        return crewMember;
    }

    public IndicatorDefinition getIndicator() {
        return indicator;
    }

    public Double getValue() {
        return value;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public Long getId() {
        return id;
    }

}