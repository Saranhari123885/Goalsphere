package com.goalsphere.controller;

import com.goalsphere.model.Goal;
import com.goalsphere.service.GoalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
@RequiredArgsConstructor
public class GoalController {

    private final GoalService goalService;

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<Goal>> getEmployeeGoals(@PathVariable Long employeeId) {
        return ResponseEntity.ok(goalService.getEmployeeGoals(employeeId));
    }

    @GetMapping("/team")
    public ResponseEntity<List<Goal>> getTeamGoals() {
        return ResponseEntity.ok(goalService.getTeamGoals());
    }

    @PostMapping("/employee/{employeeId}/quarter/{quarter}")
    public ResponseEntity<?> submitGoals(
            @PathVariable Long employeeId,
            @PathVariable String quarter,
            @RequestBody List<Goal> goals) {
        try {
            List<Goal> savedGoals = goalService.saveEmployeeGoals(employeeId, goals, quarter);
            return ResponseEntity.ok(savedGoals);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{goalId}/achievement")
    public ResponseEntity<?> updateAchievement(
            @PathVariable Long goalId,
            @RequestParam Double achievement) {
        try {
            goalService.updateGoalAchievement(goalId, achievement);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/employee/{employeeId}/quarter/{quarter}/lock")
    public ResponseEntity<?> approveAndLockGoals(
            @PathVariable Long employeeId,
            @PathVariable String quarter) {
        goalService.lockGoals(employeeId, quarter);
        return ResponseEntity.ok().build();
    }
}
