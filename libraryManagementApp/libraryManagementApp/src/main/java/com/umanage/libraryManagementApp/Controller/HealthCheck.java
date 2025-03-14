package com.umanage.libraryManagementApp.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthCheck {
    
    @GetMapping("/auth/healthcheck")
    public String healthCheck() {
        return "I am alive!";
    }
}
