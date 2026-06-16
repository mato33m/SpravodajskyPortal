package com.LRM.newsPortal.controller;

import com.LRM.newsPortal.dto.ArticleDTO;
import com.LRM.newsPortal.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ArticleController {

    @Autowired
    private ArticleService articleService;

    @GetMapping("/api/article")
    public List<ArticleDTO> getAllArticles() {
        return articleService.getAllArticles();
    }

    @GetMapping("/api/article/public")
    public List<ArticleDTO> getPublishedArticles() {
        return articleService.getPublishedArticles();
    }

    @GetMapping("/api/article/mine")
    public List<ArticleDTO> getMyArticles(Authentication authentication) {
        return articleService.getMyArticles(authentication.getName());
    }

    @GetMapping("/api/article/{id}")
    public ArticleDTO getArticle(@PathVariable int id) {
        return articleService.getArticleById(id);
    }

    @GetMapping("/api/article/edit/{id}")
    public ArticleDTO getArticleForEdit(@PathVariable int id, Authentication authentication) {
        return articleService.getArticleForEdit(id, authentication.getName());
    }

    @PutMapping("/api/article/{id}")
    public void updateArticle(@PathVariable int id, @RequestBody ArticleDTO articleDTO) {
        articleService.updateArticle(id, articleDTO);
    }

    @PostMapping("/api/article")
    public void createArticle(@RequestBody ArticleDTO articleDTO) {
        articleService.createArticle(articleDTO);
    }

    @DeleteMapping("/api/article/{id}")
    public void deleteArticle(
            @PathVariable int id,
            Authentication authentication) {
        articleService.deleteArticle(id, authentication.getName());
    }
}