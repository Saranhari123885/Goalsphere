package com.goalsphere.service;

import com.goalsphere.model.Goal;
import com.goalsphere.repository.GoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InsightService {

    private final GoalRepository goalRepository;

    public List<String> generateHeuristicInsights() {
        List<Goal> allGoals = goalRepository.findAll();
        List<String> insights = new ArrayList<>();

        if (allGoals.isEmpty()) {
            insights.add("Insufficient data to generate insights. Encourage employees to set goals.");
            return insights;
        }

        long totalGoals = allGoals.size();
        long delayedGoals = allGoals.stream().filter(g -> g.getProgressPercent() < 50 && "Q1".equals(g.getQuarter())).count(); // simplistic heuristic
        
        if (delayedGoals > 0) {
            insights.add(delayedGoals + " goals are at risk of missing targets this quarter.");
        }

        long approvedGoals = allGoals.stream().filter(g -> "Approved".equals(g.getStatus())).count();
        if ((double) approvedGoals / totalGoals < 0.5) {
            insights.add("Approval delays detected. More than 50% of goals are pending manager review.");
        }

        double avgProgress = allGoals.stream().mapToDouble(Goal::getProgressPercent).average().orElse(0.0);
        if (avgProgress > 80.0) {
            insights.add("Excellent overall performance! Average completion is high across departments.");
        } else if (avgProgress < 40.0) {
            insights.add("Organization completion is dropping. Consider reviewing Q2 targets.");
        }
        
        if(insights.isEmpty()){
             insights.add("Performance is stable. No critical risks detected.");
        }

        return insights;
    }
}
