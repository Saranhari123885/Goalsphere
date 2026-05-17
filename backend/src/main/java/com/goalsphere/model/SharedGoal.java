package com.goalsphere.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "shared_goals")
public class SharedGoal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "source_goal_id")
    private Goal sourceGoal;

    @ManyToOne
    @JoinColumn(name = "assigned_user_id")
    private User assignedUser;
}
