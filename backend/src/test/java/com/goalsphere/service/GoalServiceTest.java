package com.goalsphere.service;

import com.goalsphere.model.Goal;
import com.goalsphere.model.SharedGoal;
import com.goalsphere.model.User;
import com.goalsphere.repository.GoalRepository;
import com.goalsphere.repository.SharedGoalRepository;
import com.goalsphere.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class GoalServiceTest {

    @Mock
    private GoalRepository goalRepository;

    @Mock
    private SharedGoalRepository sharedGoalRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private GoalService goalService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
    }

    @Test
    void testSaveGoals_Valid100Percent() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(goalRepository.findByEmployeeIdAndQuarter(1L, "Q1")).thenReturn(Collections.emptyList());

        Goal g1 = new Goal(); g1.setWeightage(60.0);
        Goal g2 = new Goal(); g2.setWeightage(40.0);

        goalService.saveEmployeeGoals(1L, Arrays.asList(g1, g2), "Q1");

        verify(goalRepository, times(1)).saveAll(any());
    }

    @Test
    void testSaveGoals_InvalidWeightage_ThrowsException() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(goalRepository.findByEmployeeIdAndQuarter(1L, "Q1")).thenReturn(Collections.emptyList());

        Goal g1 = new Goal(); g1.setWeightage(50.0);
        Goal g2 = new Goal(); g2.setWeightage(40.0); // Total 90%

        Exception exception = assertThrows(RuntimeException.class, () -> 
            goalService.saveEmployeeGoals(1L, Arrays.asList(g1, g2), "Q1")
        );

        assertEquals("Total goal weightage must equal exactly 100%.", exception.getMessage());
    }

    @Test
    void testSaveGoals_LockedGoals_ThrowsException() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        Goal lockedGoal = new Goal();
        lockedGoal.setLocked(true);
        when(goalRepository.findByEmployeeIdAndQuarter(1L, "Q1")).thenReturn(Collections.singletonList(lockedGoal));

        Exception exception = assertThrows(RuntimeException.class, () -> 
            goalService.saveEmployeeGoals(1L, Collections.singletonList(new Goal()), "Q1")
        );

        assertEquals("Goals are locked. Contact Admin.", exception.getMessage());
    }

    @Test
    void testSharedGoalSync() {
        Goal sourceGoal = new Goal();
        sourceGoal.setId(10L);
        sourceGoal.setTarget(100.0);
        sourceGoal.setTitle("Shared KPI");

        when(goalRepository.findById(10L)).thenReturn(Optional.of(sourceGoal));

        User assignedUser = new User();
        assignedUser.setId(2L);
        SharedGoal mapping = new SharedGoal();
        mapping.setAssignedUser(assignedUser);
        
        when(sharedGoalRepository.findBySourceGoalId(10L)).thenReturn(Collections.singletonList(mapping));

        Goal linkedGoal = new Goal();
        linkedGoal.setTitle("Shared KPI");
        when(goalRepository.findByEmployeeId(2L)).thenReturn(Collections.singletonList(linkedGoal));

        goalService.updateGoalAchievement(10L, 50.0);

        assertEquals(50.0, sourceGoal.getAchievement());
        assertEquals(50.0, linkedGoal.getAchievement());
        verify(goalRepository, atLeastOnce()).save(any());
    }
}
