package com.goalsphere.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "cycle_configs")
public class CycleConfig {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String quarter; // Q1, Q2, Q3, Q4
    
    private LocalDate startDate;
    private LocalDate endDate;
    
    private boolean isActive;
}
