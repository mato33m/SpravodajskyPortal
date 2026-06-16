package com.LRM.newsPortal.service;

import com.LRM.newsPortal.dto.TopicDTO;
import com.LRM.newsPortal.model.Topic;
import com.LRM.newsPortal.repository.TopicRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TopicService {

    private static final Logger log = LoggerFactory.getLogger(TopicService.class);

    @Autowired
    private TopicRepository topicRepository;

    public TopicDTO getTopicById(String topicName) {

        Topic topic = topicRepository.findById(topicName)
                .orElse(null);

        if (topic == null) {
            return null;
        }

        return new TopicDTO(
                topic.getTopicName()
        );
    }

    public List<TopicDTO> getAllTopics() {

        return topicRepository.findAll()
                .stream()
                .map(topic -> new TopicDTO(
                        topic.getTopicName()
                ))
                .toList();
    }

    public void updateTopic(String topicName, TopicDTO topicDTO) {

        Topic topic = new Topic(
                topicDTO.topicName()
        );

        topicRepository.deleteById(topicName);
        topicRepository.save(topic);

        log.info("Updating topic {}", topicDTO);
    }

    public void createTopic(TopicDTO topicDTO) {

        Topic topic = new Topic(
                topicDTO.topicName()
        );

        topicRepository.save(topic);

        log.info("Creating topic {}", topicDTO);
    }

    public void deleteTopic(String topicName) {

        topicRepository.deleteById(topicName);

        log.info("Deleting topic {}", topicName);
    }
}