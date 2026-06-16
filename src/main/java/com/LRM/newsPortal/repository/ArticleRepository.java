package com.LRM.newsPortal.repository;

import com.LRM.newsPortal.model.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ArticleRepository extends JpaRepository<Article, Integer> {

    @Query("SELECT DISTINCT a FROM Article a JOIN a.tags at WHERE a.status = 'PUBLISHED' AND at.tag.tagName = :tagName")
    List<Article> findPublishedByTagName(@Param("tagName") String tagName);

    @Query("SELECT a FROM Article a WHERE a.status = 'PUBLISHED' AND (LOWER(a.title) LIKE LOWER(CONCAT('%', :q, '%')) OR LOWER(a.content) LIKE LOWER(CONCAT('%', :q, '%')))")
    List<Article> searchPublished(@Param("q") String q);

}