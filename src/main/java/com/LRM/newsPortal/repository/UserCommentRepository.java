package com.LRM.newsPortal.repository;

import com.LRM.newsPortal.model.UserComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserCommentRepository extends JpaRepository<UserComment, Integer> {
    List<UserComment> findByArticle_ArticleId(int articleId);
}