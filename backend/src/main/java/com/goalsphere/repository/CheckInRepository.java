package com.goalsphere.repository;

import com.goalsphere.model.CheckIn;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CheckInRepository extends JpaRepository<CheckIn, Long> {
    List<CheckIn> findByGoalId(Long goalId);
}
