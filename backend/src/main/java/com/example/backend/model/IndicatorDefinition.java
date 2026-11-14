package com.example.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class IndicatorDefinition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;          // "Heart rate"
    private String unit;          // "bpm"

    @Enumerated(EnumType.STRING)
    private BodySystem bodySystem;

    private Double normalMin;
    private Double normalMax;
    private Double cautionMin;
    private Double cautionMax;

    @Column(length = 1000)
    private String howToMeasure;

    @Column(length = 1000)
    private String whyItMatters;

    @Column(length = 1000)
    private String relatedHazard;

    @Column(length = 500)
    private String source;        // NASA or space-agency citation

    protected IndicatorDefinition() { }

    public IndicatorDefinition(String name, String unit, BodySystem bodySystem,
                               Double normalMin, Double normalMax,
                               Double cautionMin, Double cautionMax,
                               String howToMeasure, String whyItMatters,
                               String relatedHazard, String source) {
        this.name = name;
        this.unit = unit;
        this.bodySystem = bodySystem;
        this.normalMin = normalMin;
        this.normalMax = normalMax;
        this.cautionMin = cautionMin;
        this.cautionMax = cautionMax;
        this.howToMeasure = howToMeasure;
        this.whyItMatters = whyItMatters;
        this.relatedHazard = relatedHazard;
        this.source = source;
    }
    public String getName() {
        return name;
    }

    public String getUnit() {
        return unit;
    }

    public BodySystem getBodySystem() {
        return bodySystem;
    }

    public Double getNormalMin() {
        return normalMin;
    }

    public Double getNormalMax() {
        return normalMax;
    }

    public Double getCautionMin() {
        return cautionMin;
    }

    public Double getCautionMax() {
        return cautionMax;
    }

    public String getHowToMeasure() {
        return howToMeasure;
    }

    public String getWhyItMatters() {
        return whyItMatters;
    }

    public String getRelatedHazard() {
        return relatedHazard;
    }

    public String getSource() {
        return source;
    }

    public Long getId() {
        return id;
    }
}