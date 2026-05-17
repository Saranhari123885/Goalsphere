package com.goalsphere.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@EnableScheduling
@Slf4j
public class NotificationScheduler {

    // Runs every day at 8 AM
    @Scheduled(cron = "0 0 8 * * ?")
    public void checkDeadlinesAndSendReminders() {
        log.info("Running daily notification scheduler at {}", LocalDateTime.now());
        
        // Mocking email dispatch to avoid SendGrid setup complexity for hackathon
        log.info("--> [EMAIL MOCK] Checking for employees who have not submitted goals...");
        // In a real scenario, we would query goalRepository for users missing goals in active cycle
        
        log.info("--> [EMAIL MOCK] Checking for managers with pending approvals...");
        
        log.info("--> [EMAIL MOCK] Sending 'Check-in deadline approaching' to all users.");
        
        log.info("Escalation chain checked. Escorting delayed goals to HR.");
    }
}
