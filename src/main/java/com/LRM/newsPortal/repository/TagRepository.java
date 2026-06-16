package com.LRM.newsPortal.repository;

import com.LRM.newsPortal.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TagRepository extends JpaRepository<Tag, String> {}