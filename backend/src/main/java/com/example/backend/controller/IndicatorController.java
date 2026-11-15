package com.example.backend.controller;

import com.example.backend.model.IndicatorDefinition;
import com.example.backend.repository.IndicatorDefinitionRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class IndicatorController {

    private final IndicatorDefinitionRepository indicatorRepository;

    public IndicatorController(IndicatorDefinitionRepository indicatorRepository) {
        this.indicatorRepository = indicatorRepository;
    }

    @GetMapping("/indicators")
    public List<IndicatorDefinition> getIndicators() {
        return indicatorRepository.findAll();

    }

}