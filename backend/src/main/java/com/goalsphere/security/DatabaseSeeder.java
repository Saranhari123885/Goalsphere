package com.goalsphere.security;

import com.goalsphere.model.Role;
import com.goalsphere.model.User;
import com.goalsphere.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedUsers();
    }

    private void seedUsers() {
        // Admin
        if (userRepository.findByEmail("admin@goalsphere.com").isEmpty()) {
            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail("admin@goalsphere.com");
            admin.setPassword(passwordEncoder.encode("Demo123"));
            admin.setRole(Role.ADMIN);
            admin.setDepartment("Executive");
            userRepository.save(admin);
        }

        // Manager
        User manager = null;
        Optional<User> existingManager = userRepository.findByEmail("manager@goalsphere.com");
        if (existingManager.isEmpty()) {
            manager = new User();
            manager.setName("Manager User");
            manager.setEmail("manager@goalsphere.com");
            manager.setPassword(passwordEncoder.encode("Demo123"));
            manager.setRole(Role.MANAGER);
            manager.setDepartment("Engineering");
            manager = userRepository.save(manager);
        } else {
            manager = existingManager.get();
        }

        // Employee
        if (userRepository.findByEmail("employee@goalsphere.com").isEmpty()) {
            User employee = new User();
            employee.setName("Employee User");
            employee.setEmail("employee@goalsphere.com");
            employee.setPassword(passwordEncoder.encode("Demo123"));
            employee.setRole(Role.EMPLOYEE);
            employee.setDepartment("Engineering");
            employee.setManager(manager);
            userRepository.save(employee);
        }
    }
}
