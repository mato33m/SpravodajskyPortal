package com.LRM.newsPortal.controller;

import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.LRM.newsPortal.dto.UserDTO;
import com.LRM.newsPortal.service.UserService;

import java.util.List;


@RestController
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/api/user")
    public List<UserDTO> getAllUsers(){
        return userService.getAllUsers();
    }

    @GetMapping("/api/user/{id}")
    public UserDTO getUser(@PathVariable int id){
        return userService.getUserById(id);
    }

    @PutMapping("/api/user/{id}")
    public ResponseEntity<?> updateUser(@PathVariable int id,
                                        @RequestBody UserDTO userDTO,
                                        Authentication authentication) {
        boolean updated = userService.updateUser(id, userDTO, authentication.getName());
        return updated
                ? ResponseEntity.ok().build()
                : ResponseEntity.status(403).body("You can only edit your own profile");
    }

    @PostMapping("/api/user")
    public void createUser(@RequestBody UserDTO userDTO){
        userService.createUser(userDTO);
    }

    @DeleteMapping("/api/user/{id}")
    public void deleteUser(@PathVariable int id){
        userService.deleteUser(id);
    }
}