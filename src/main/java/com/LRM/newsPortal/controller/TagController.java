package com.LRM.newsPortal.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.LRM.newsPortal.dto.TagDTO;
import com.LRM.newsPortal.service.TagService;

import java.util.List;

@RestController
public class TagController {
    @Autowired
    private TagService tagService;

    @GetMapping("/api/tag")
    public List<TagDTO> getAllTags(){
        return tagService.getAllTags();
    }

    @GetMapping("/api/tag/{tagName}")
    public TagDTO getTag(@PathVariable String tagName){
        return tagService.getTagById(tagName);
    }

    @PutMapping("/api/tag/{tagName}")
    public void updateTag(@PathVariable String tagName, @RequestBody TagDTO tagDTO){
        tagService.updateTag(tagName, tagDTO);
    }

    @PostMapping("/api/tag")
    public void createTag(@RequestBody TagDTO tagDTO){
        tagService.createTag(tagDTO);
    }

    @DeleteMapping("/api/tag/{tagName}")
    public void deleteTag(@PathVariable String tagName){
        tagService.deleteTag(tagName);
    }
}