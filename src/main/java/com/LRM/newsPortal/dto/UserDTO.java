package com.LRM.newsPortal.dto;

import java.time.LocalDateTime;

public record UserDTO(
        int userId,
        String username,
        String passwordHash,
        String firstName,
        String lastName,
        String role,
        String bio,
        String email,
        LocalDateTime dateJoined,
        boolean banned
) {}