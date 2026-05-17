package com.goalsphere.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "goals")
public class Goal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    
    @Column(length = 1000)
    private String description;

    private String thrustArea;

    private String unitOfMeasurement; // Numeric, Percentage, Timeline, Zero Based

    private String type;
    
    private Double target;
    
    private Double weightage; // 10% to 100%

    private String status; // Draft, Submitted, Approved, Returned

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private User employee;

    private String quarter; // Q1, Q2, Q3, Q4

    private Double achievement = 0.0;
    
    private Double progressPercent = 0.0;
    
    private boolean isLocked = false;
}
