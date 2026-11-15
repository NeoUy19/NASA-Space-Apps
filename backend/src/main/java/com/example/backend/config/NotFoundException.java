package com.example.backend.config;

public class NotFoundException extends RuntimeException {
    public NotFoundException(String message) {
        super(message);
    }
}