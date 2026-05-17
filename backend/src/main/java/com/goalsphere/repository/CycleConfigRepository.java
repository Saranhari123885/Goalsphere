package com.goalsphere.repository;

import com.goalsphere.model.CycleConfig;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CycleConfigRepository extends JpaRepository<CycleConfig, Long> {
    Optional<CycleConfig> findByIsActiveTrue();
    Optional<CycleConfig> findByQuarter(String quarter);
}
