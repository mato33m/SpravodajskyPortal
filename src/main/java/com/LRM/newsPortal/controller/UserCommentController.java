package com.LRM.newsPortal.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.LRM.newsPortal.dto.UserCommentDTO;
import com.LRM.newsPortal.service.UserCommentService;

import java.util.List;

@RestController
public class UserCommentController {
    @Autowired
    private UserCommentService userCommentService;

    @GetMapping("/api/comment")
    public List<UserCommentDTO> getAllComments(){
        return userCommentService.getAllComments();
    }

    @GetMapping("/api/comment/{id}")
    public UserCommentDTO getComment(@PathVariable int id){
        return userCommentService.getCommentById(id);
    }

    @PutMapping("/api/comment/{id}")
    public void updateComment(@PathVariable int id, @RequestBody UserCommentDTO userCommentDTO){
        userCommentService.updateComment(id, userCommentDTO);
    }

    @PostMapping("/api/comment")
    public void createComment(@RequestBody UserCommentDTO userCommentDTO, Authentication authentication){
        userCommentService.createComment(userCommentDTO, authentication.getName());
    }

    @DeleteMapping("/api/comment/{id}")
    public void deleteComment(@PathVariable int id){
        userCommentService.deleteComment(id);
    }
}