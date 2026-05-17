package com.goalsphere.controller;

import com.goalsphere.model.CheckIn;
import com.goalsphere.model.SharedGoal;
import com.goalsphere.repository.CheckInRepository;
import com.goalsphere.repository.SharedGoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/manager")
@RequiredArgsConstructor
public class ManagerController {

    private final CheckInRepository checkInRepository;
    private final SharedGoalRepository sharedGoalRepository;

    @GetMapping("/check-ins")
    public ResponseEntity<List<CheckIn>> getCheckIns() {
        return ResponseEntity.ok(checkInRepository.findAll());
    }

    @GetMapping("/shared-goals")
    public ResponseEntity<List<SharedGoal>> getSharedGoals() {
        return ResponseEntity.ok(sharedGoalRepository.findAll());
    }
}
