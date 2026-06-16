package com.LRM.newsPortal.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.LRM.newsPortal.dto.TopicDTO;
import com.LRM.newsPortal.service.TopicService;

import java.util.List;

@RestController
public class TopicController {
    @Autowired
    private TopicService topicService;

    @GetMapping("/api/topic")
    public List<TopicDTO> getAllTopics(){
        return topicService.getAllTopics();
    }

    @GetMapping("/api/topic/{topicName}")
    public TopicDTO getTopic(@PathVariable String topicName){
        return topicService.getTopicById(topicName);
    }

    @PutMapping("/api/topic/{topicName}")
    public void updateTopic(@PathVariable String topicName, @RequestBody TopicDTO topicDTO){
        topicService.updateTopic(topicName, topicDTO);
    }

    @PostMapping("/api/topic")
    public void createTopic(@RequestBody TopicDTO topicDTO){
        topicService.createTopic(topicDTO);
    }

    @DeleteMapping("/api/topic/{topicName}")
    public void deleteTopic(@PathVariable String topicName){
        topicService.deleteTopic(topicName);
    }
}