package com.goalsphere.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String title;
    
    @Column(length = 500)
    private String message;

    private boolean isRead = false;

    private LocalDateTime timestamp = LocalDateTime.now();
}
