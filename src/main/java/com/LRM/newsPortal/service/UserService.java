package com.LRM.newsPortal.service;

import com.LRM.newsPortal.dto.UserDTO;
import com.LRM.newsPortal.model.User;
import com.LRM.newsPortal.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.LinkedList;
import java.util.List;

@Service
public class UserService {
    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserDTO getUserById(int userId) {
        User user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            return null;
        }

        return new UserDTO(
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
    }

    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();

        List<UserDTO> usersDTO = new LinkedList<>();

        for (User user : users) {
            usersDTO.add(new UserDTO(
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
            ));
        }

        return usersDTO;
    }

    public boolean updateUser(int userId, UserDTO userDTO, String loggedInUsername) {
        User requestingUser = userRepository.findByUsername(loggedInUsername).orElse(null);
        User targetUser = userRepository.findById(userId).orElse(null);

        System.out.println("=== UPDATE USER ===");
        System.out.println("Requesting: " + loggedInUsername);
        System.out.println("Target userId: " + userId);
        System.out.println("isAdmin check on role: " + (userRepository.findByUsername(loggedInUsername).map(User::getRole).orElse("NOT FOUND")));

        if (requestingUser == null || targetUser == null) return false;

        boolean isOwnProfile = requestingUser.getUserId() == userId;
        boolean isAdmin = requestingUser.getRole().equals("ADMIN");

        if (!isOwnProfile && !isAdmin) return false;

        if (!isAdmin) {
            // regular users can only edit their own profile info
            if (userDTO.passwordHash() != null && !userDTO.passwordHash().isBlank()) {
                targetUser.setPasswordHash(passwordEncoder.encode(userDTO.passwordHash()));
            }
            targetUser.setFirstName(userDTO.firstName());
            targetUser.setLastName(userDTO.lastName());
            targetUser.setBio(userDTO.bio());
            targetUser.setEmail(userDTO.email());
        } else {
            // admins can change everything including role and banned status
            if (userDTO.passwordHash() != null && !userDTO.passwordHash().isBlank()) {
                targetUser.setPasswordHash(passwordEncoder.encode(userDTO.passwordHash()));
            }
            targetUser.setFirstName(userDTO.firstName());
            targetUser.setLastName(userDTO.lastName());
            targetUser.setRole(userDTO.role());
            targetUser.setBio(userDTO.bio());
            targetUser.setEmail(userDTO.email());
            targetUser.setBanned(userDTO.banned());
        }

        userRepository.save(targetUser);
        log.info("Updating user {}", userId);
        return true;
    }

    public void createUser(UserDTO userDTO) {
        User user = new User(
                0,
                userDTO.username(),
                passwordEncoder.encode(userDTO.passwordHash()),
                userDTO.firstName(),
                userDTO.lastName(),
                userDTO.role(),
                userDTO.bio(),
                LocalDateTime.now(),
                userDTO.email(),
                false
        );

        userRepository.save(user);

        log.info("Creating user {}", userDTO);
    }

    public void deleteUser(int userId) {
        userRepository.deleteById(userId);

        log.info("Deleting user {}", userId);
    }
}
