package com.goalsphere.repository;

import com.goalsphere.model.Goal;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GoalRepository extends JpaRepository<Goal, Long> {
    List<Goal> findByEmployeeId(Long employeeId);
    List<Goal> findByEmployeeIdAndQuarter(Long employeeId, String quarter);
}
