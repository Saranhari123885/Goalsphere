package com.goalsphere.controller;

import com.goalsphere.model.Role;
import com.goalsphere.model.User;
import com.goalsphere.repository.UserRepository;
import com.goalsphere.security.JwtService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            var user = new User();
            user.setName(request.getName());
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setRole(request.getRole() != null ? Role.valueOf(request.getRole().toUpperCase()) : Role.EMPLOYEE);
            
            repository.save(user);
            Map<String, Object> extraClaims = new java.util.HashMap<>();
            extraClaims.put("id", user.getId());
            extraClaims.put("email", user.getEmail());
            extraClaims.put("role", user.getRole().name());
            
            var jwtToken = jwtService.generateToken(extraClaims, user);
            return ResponseEntity.ok(new AuthResponse(jwtToken, user.getId(), user.getRole().name()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Registration failed. Email might already exist.");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            var user = repository.findByEmail(request.getEmail()).orElseThrow();
            
            Map<String, Object> extraClaims = new java.util.HashMap<>();
            extraClaims.put("id", user.getId());
            extraClaims.put("email", user.getEmail());
            extraClaims.put("role", user.getRole().name());
            
            var jwtToken = jwtService.generateToken(extraClaims, user);
            return ResponseEntity.ok(new AuthResponse(jwtToken, user.getId(), user.getRole().name()));
        } catch (org.springframework.security.core.AuthenticationException e) {
            return ResponseEntity.status(401).body("Invalid email or password.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }
}

@Data
class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String role;
}

@Data
class AuthRequest {
    private String email;
    private String password;
}

@Data
class AuthResponse {
    private final String token;
    private final Long userId;
    private final String role;
}
