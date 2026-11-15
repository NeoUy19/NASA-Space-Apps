package com.example.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.StatusResponse;
import com.example.backend.service.AssessmentService;

@RestController 
@RequestMapping("/api/crew")
public class StatusController {
    private final AssessmentService assessmentService;

    public StatusController(AssessmentService assessmentService){
        this.assessmentService = assessmentService;
    }

    @GetMapping("/{id}/status")
    public StatusResponse getStatus(@PathVariable Long id){
        return assessmentService.assess(id);
    }
}
