package com.goalsphere.service;

import com.goalsphere.model.AuditLog;
import com.goalsphere.model.Goal;
import com.goalsphere.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Aspect
@Component
@RequiredArgsConstructor
@Slf4j
public class AuditAspect {

    private final AuditLogRepository auditLogRepository;

    @AfterReturning(pointcut = "execution(* com.goalsphere.service.GoalService.updateGoalAchievement(..))", returning = "result")
    public void logAchievementUpdate(JoinPoint joinPoint, Object result) {
        Object[] args = joinPoint.getArgs();
        if (args.length == 2 && args[0] instanceof Long && args[1] instanceof Double) {
            Long goalId = (Long) args[0];
            Double newAchievement = (Double) args[1];
            
            AuditLog auditLog = new AuditLog();
            auditLog.setAction("ACHIEVEMENT_UPDATE");
            auditLog.setNewValue("Goal " + goalId + " updated to " + newAchievement);
            auditLog.setTimestamp(LocalDateTime.now());
            // Note: In a real system, we would inject SecurityContextHolder to get the current user
            // and fetch the old value before the update to log it accurately.
            auditLogRepository.save(auditLog);
            
            log.info("Audit Logged: " + auditLog.getNewValue());
        }
    }
}
