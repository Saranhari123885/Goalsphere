package com.goalsphere.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "audit_logs")
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String action;
    
    @Column(length = 1000)
    private String oldValue;
    
    @Column(length = 1000)
    private String newValue;

    private LocalDateTime timestamp = LocalDateTime.now();
}
