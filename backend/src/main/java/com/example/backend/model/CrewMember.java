package com.example.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class CrewMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    //crew members id, name, and role
    private Long id;
    private String name;
    private String role;

    protected CrewMember() { }   // JPA needs an empty constructor

    public CrewMember(String name, String role) {
        this.role = role;
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public String getRole() {
        return role;
    }

    public Long getId() {
        return id;
    }
}
