package com.LRM.newsPortal.repository;

import com.LRM.newsPortal.model.Topic;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TopicRepository extends JpaRepository<Topic, String> {}