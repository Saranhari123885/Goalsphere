package com.goalsphere.controller;

import com.goalsphere.model.User;
import com.goalsphere.model.AuditLog;
import com.goalsphere.model.CycleConfig;
import com.goalsphere.model.Goal;
import com.goalsphere.repository.UserRepository;
import com.goalsphere.repository.AuditLogRepository;
import com.goalsphere.repository.CycleConfigRepository;
import com.goalsphere.repository.GoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;
    private final CycleConfigRepository cycleConfigRepository;
    private final GoalRepository goalRepository;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<List<AuditLog>> getAuditLogs() {
        return ResponseEntity.ok(auditLogRepository.findAll());
    }

    @GetMapping("/cycle-configs")
    public ResponseEntity<List<CycleConfig>> getCycleConfigs() {
        return ResponseEntity.ok(cycleConfigRepository.findAll());
    }

    @GetMapping("/unlock-requests")
    public ResponseEntity<List<Goal>> getUnlockRequests() {
        return ResponseEntity.ok(goalRepository.findAll().stream().filter(Goal::isLocked).toList());
    }
}
