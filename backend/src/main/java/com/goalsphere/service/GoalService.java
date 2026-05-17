package com.goalsphere.service;

import com.goalsphere.model.Goal;
import com.goalsphere.model.SharedGoal;
import com.goalsphere.model.User;
import com.goalsphere.repository.GoalRepository;
import com.goalsphere.repository.SharedGoalRepository;
import com.goalsphere.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GoalService {

    private final GoalRepository goalRepository;
    private final SharedGoalRepository sharedGoalRepository;
    private final UserRepository userRepository;

    public List<Goal> getEmployeeGoals(Long employeeId) {
        return goalRepository.findByEmployeeId(employeeId);
    }

    public List<Goal> getTeamGoals() {
        return goalRepository.findAll();
    }

    @Transactional
    public List<Goal> saveEmployeeGoals(Long employeeId, List<Goal> newGoals, String quarter) {
        User employee = userRepository.findById(employeeId).orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Goal> existingGoals = goalRepository.findByEmployeeIdAndQuarter(employeeId, quarter);
        
        // Validation: Locked check
        if (existingGoals.stream().anyMatch(Goal::isLocked)) {
            throw new RuntimeException("Goals are locked. Contact Admin.");
        }

        // Validation: Max 8 goals
        if (newGoals.size() > 8) {
            throw new RuntimeException("Maximum 8 goals allowed per employee.");
        }

        double totalWeightage = 0.0;
        
        for (Goal goal : newGoals) {
            // Validation: Min 10% weightage
            if (goal.getWeightage() < 10.0) {
                throw new RuntimeException("Minimum weightage per goal is 10%.");
            }
            totalWeightage += goal.getWeightage();
            goal.setEmployee(employee);
            goal.setQuarter(quarter);
            goal.setStatus("Submitted");
        }

        // Validation: Total weightage = 100%
        if (Math.abs(totalWeightage - 100.0) > 0.01) {
            throw new RuntimeException("Total goal weightage must equal exactly 100%.");
        }

        // Delete existing draft/submitted goals and replace
        goalRepository.deleteAll(existingGoals);
        return goalRepository.saveAll(newGoals);
    }

    @Transactional
    public void lockGoals(Long employeeId, String quarter) {
        List<Goal> goals = goalRepository.findByEmployeeIdAndQuarter(employeeId, quarter);
        for (Goal goal : goals) {
            goal.setLocked(true);
            goal.setStatus("Approved");
        }
        goalRepository.saveAll(goals);
    }
    
    @Transactional
    public void updateGoalAchievement(Long goalId, Double newAchievement) {
        Goal goal = goalRepository.findById(goalId).orElseThrow(() -> new RuntimeException("Goal not found"));
        goal.setAchievement(newAchievement);
        
        // Progress Formula
        if (goal.getTarget() != null && goal.getTarget() > 0) {
            double progress = (newAchievement / goal.getTarget()) * 100;
            goal.setProgressPercent(Math.min(progress, 100.0)); // Cap at 100%
        } else if ("Zero Based".equals(goal.getType())) {
            goal.setProgressPercent(newAchievement == 0 ? 100.0 : 0.0);
        }
        
        goalRepository.save(goal);
        
        // Shared Goal Synchronization
        List<SharedGoal> sharedGoals = sharedGoalRepository.findBySourceGoalId(goalId);
        for (SharedGoal shared : sharedGoals) {
            // Update achievement of all linked goals for other employees
            // In a real implementation, we would fetch the actual Goal entity assigned to the other user
            // that is linked via this mapping. For simplicity, we assume SharedGoal maps directly.
            // Wait, SharedGoal only maps to assignedUser. Let's assume the assignedUser has a matching goal 
            // with the same title created for them.
            List<Goal> assignedUserGoals = goalRepository.findByEmployeeId(shared.getAssignedUser().getId());
            assignedUserGoals.stream()
                .filter(g -> g.getTitle().equals(goal.getTitle()))
                .findFirst()
                .ifPresent(g -> {
                    g.setAchievement(newAchievement);
                    g.setProgressPercent(goal.getProgressPercent());
                    goalRepository.save(g);
                });
        }
    }
}
