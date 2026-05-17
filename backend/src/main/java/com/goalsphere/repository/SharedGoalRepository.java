package com.goalsphere.repository;

import com.goalsphere.model.SharedGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SharedGoalRepository extends JpaRepository<SharedGoal, Long> {
    List<SharedGoal> findByAssignedUserId(Long userId);
    List<SharedGoal> findBySourceGoalId(Long sourceGoalId);
}
