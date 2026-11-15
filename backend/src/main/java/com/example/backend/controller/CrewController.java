package com.example.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.model.CrewMember;
import com.example.backend.repository.CrewMemberRepository;

@RestController
@RequestMapping("/api")
public class CrewController {

    private final CrewMemberRepository crewMemberRepository;

    public CrewController(CrewMemberRepository crewMemberRepository){
        this.crewMemberRepository = crewMemberRepository;
    }

    @GetMapping("/crew")
    public List<CrewMember> getCrew() {
        return crewMemberRepository.findAll();
    }
}