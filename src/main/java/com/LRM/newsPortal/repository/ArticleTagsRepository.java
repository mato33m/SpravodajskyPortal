package com.LRM.newsPortal.repository;

import com.LRM.newsPortal.model.ArticleTags;
import com.LRM.newsPortal.model.ArticleTagsId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ArticleTagsRepository extends JpaRepository<ArticleTags, ArticleTagsId> {
    List<ArticleTags> findByArticle_ArticleId(int articleId);
}