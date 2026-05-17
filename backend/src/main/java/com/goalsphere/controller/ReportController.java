package com.goalsphere.controller;

import com.goalsphere.model.Goal;
import com.goalsphere.repository.GoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final GoalRepository goalRepository;

    @GetMapping("/summary")
    public ResponseEntity<List<Goal>> getSummary() {
        return ResponseEntity.ok(goalRepository.findAll());
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportGoalsCsv() {
        List<Goal> goals = goalRepository.findAll();
        
        StringBuilder csv = new StringBuilder();
        csv.append("Employee Name,Goal Title,Quarter,Target,Achievement,Completion %,Status\n");
        
        for (Goal goal : goals) {
            String empName = goal.getEmployee() != null ? goal.getEmployee().getName() : "Unknown";
            csv.append(String.format("\"%s\",\"%s\",\"%s\",%f,%f,%f,\"%s\"\n",
                    empName,
                    goal.getTitle().replace("\"", "\"\""),
                    goal.getQuarter(),
                    goal.getTarget(),
                    goal.getAchievement(),
                    goal.getProgressPercent(),
                    goal.getStatus()
            ));
        }

        byte[] csvBytes = csv.toString().getBytes();
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=goals_report.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvBytes);
    }
}
