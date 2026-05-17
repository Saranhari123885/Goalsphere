package com.goalsphere.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "check_ins")
public class CheckIn {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "goal_id")
    private Goal goal;

    private Double achievement;
    private Double progressPercent;
    
    private String status; // Pending, Approved, Returned
    
    @Column(length = 2000)
    private String managerComment;
    
    private LocalDateTime timestamp = LocalDateTime.now();
}
