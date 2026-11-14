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

    // TODO: baseline values, once you've decided how to store them

    protected CrewMember() { }   // JPA needs an empty constructor

    public CrewMember(String name /*, role */) {
        this.name = name;
    }

}
