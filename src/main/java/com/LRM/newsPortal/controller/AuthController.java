package com.LRM.newsPortal.controller;

import com.LRM.newsPortal.dto.UserDTO;
import com.LRM.newsPortal.model.User;
import com.LRM.newsPortal.repository.UserRepository;
import com.LRM.newsPortal.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        System.out.println("=== REGISTER ATTEMPT ===");
        System.out.println("Body: " + body);
        String username = body.get("username");
        String password = body.get("password");

        User user = userRepository.findByUsername(username).orElse(null);

        if (user == null || !passwordEncoder.matches(password, user.getPasswordHash())) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        if (user.isBanned()) {
            return ResponseEntity.status(403).body("Account is banned");
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());

        UserDTO userDTO = new UserDTO(
                user.getUserId(),
                user.getUsername(),
                null,
                user.getFirstName(),
                user.getLastName(),
                user.getRole(),
                user.getBio(),
                user.getEmail(),
                user.getDateJoined(),
                user.isBanned()
        );

        return ResponseEntity.ok(Map.of(
                "token", token,
                "user", userDTO
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        String firstName = body.get("firstName");
        String lastName = body.get("lastName");
        String email = body.get("email");

        if (username == null || username.isBlank() ||
                password == null || password.isBlank() ||
                firstName == null || firstName.isBlank() ||
                lastName == null || lastName.isBlank()) {
            return ResponseEntity.status(400).body("Username, password, first and last name are required");
        }

        if (userRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.status(409).body("Username already taken");
        }

        User user = new User(
                0,
                username,
                passwordEncoder.encode(password),
                firstName,
                lastName,
                "USER",
                null,
                LocalDateTime.now(),
                email,
                false
        );

        userRepository.save(user);

        User saved = userRepository.findByUsername(username).orElseThrow();
        String token = jwtUtil.generateToken(saved.getUsername(), saved.getRole());

        UserDTO userDTO = new UserDTO(
                saved.getUserId(),
                saved.getUsername(),
                null,
                saved.getFirstName(),
                saved.getLastName(),
                saved.getRole(),
                saved.getBio(),
                saved.getEmail(),
                saved.getDateJoined(),
                saved.isBanned()
        );

        return ResponseEntity.ok(Map.of(
                "token", token,
                "user", userDTO
        ));
    }
}