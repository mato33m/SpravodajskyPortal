package com.LRM.newsPortal.service;

import com.LRM.newsPortal.dto.ArticleDTO;
import com.LRM.newsPortal.dto.TagDTO;
import com.LRM.newsPortal.dto.UserCommentDTO;
import com.LRM.newsPortal.dto.UserDTO;
import com.LRM.newsPortal.model.Article;
import com.LRM.newsPortal.model.ArticleTags;
import com.LRM.newsPortal.model.ArticleTagsId;
import com.LRM.newsPortal.model.Tag;
import com.LRM.newsPortal.model.Topic;
import com.LRM.newsPortal.model.User;
import com.LRM.newsPortal.repository.ArticleRepository;
import com.LRM.newsPortal.repository.ArticleTagsRepository;
import com.LRM.newsPortal.repository.TagRepository;
import com.LRM.newsPortal.repository.TopicRepository;
import com.LRM.newsPortal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.List;

@Service
public class ArticleService {

    @Autowired private ArticleRepository articleRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private TopicRepository topicRepository;
    @Autowired private TagRepository tagRepository;
    @Autowired private ArticleTagsRepository articleTagsRepository;

    private ArticleDTO toDTO(Article article) {
        List<UserCommentDTO> comments = article.getComments() == null ? List.of() :
                article.getComments()
                        .stream()
                        .map(c -> new UserCommentDTO(
                                c.getCommentId(),
                                c.getArticle().getArticleId(),
                                c.getAuthor().getUserId(),
                                c.getContent(),
                                c.getRating()
                        ))
                        .toList();

        List<TagDTO> tags = article.getTags() == null ? List.of() :
                article.getTags()
                        .stream()
                        .map(t -> new TagDTO(t.getTag().getTagName()))
                        .toList();

        return new ArticleDTO(
                article.getArticleId(),
                new UserDTO(
                        article.getWriter().getUserId(),
                        article.getWriter().getUsername(),
                        article.getWriter().getPasswordHash(),
                        article.getWriter().getFirstName(),
                        article.getWriter().getLastName(),
                        article.getWriter().getRole(),
                        article.getWriter().getBio(),
                        article.getWriter().getEmail(),
                        article.getWriter().getDateJoined(),
                        article.getWriter().isBanned()
                ),
                article.getTopic().getTopicName(),
                null,
                article.getReleaseDate(),
                article.getContent(),
                article.getStatus(),
                article.getTitle(),
                article.getImageUrl(),
                comments,
                tags
        );
    }

    public ArticleDTO getArticleById(int articleId) {
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new RuntimeException("Article not found"));

        if (!"PUBLISHED".equals(article.getStatus())) {
            throw new RuntimeException("Article not available");
        }

        return toDTO(article);
    }

    public List<ArticleDTO> getAllArticles() {
        return articleRepository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public List<ArticleDTO> getPublishedArticles() {
        return articleRepository.findAll()
                .stream()
                .filter(article -> "PUBLISHED".equals(article.getStatus()))
                .map(this::toDTO)
                .toList();
    }

    public void createArticle(ArticleDTO dto) {

        User writer = userRepository.findById(dto.writer().userId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Topic topic = topicRepository.findById(dto.topicName())
                .orElseThrow(() -> new RuntimeException("Topic not found"));

        Article article = new Article();
        article.setWriter(writer);
        article.setTopic(topic);
        article.setContent(dto.content());
        article.setStatus("CONCEPT");
        article.setTitle(dto.title());
        article.setImageUrl(dto.imageUrl());
        article.setReleaseDate(new Timestamp(System.currentTimeMillis()));

        Article savedArticle = articleRepository.save(article);
        syncArticleTags(savedArticle, dto.tags());
    }

    @Transactional
    public void updateArticle(int articleId, ArticleDTO dto) {

        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new RuntimeException("Article not found"));

        User writer = userRepository.findById(dto.writer().userId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Topic topic = topicRepository.findById(dto.topicName())
                .orElseThrow(() -> new RuntimeException("Topic not found"));

        article.setWriter(writer);
        article.setTopic(topic);
        article.setContent(dto.content());
        article.setStatus(dto.status());
        article.setTitle(dto.title());
        article.setImageUrl(dto.imageUrl());
        article.setReleaseDate(dto.releaseDate());

        Article savedArticle = articleRepository.save(article);
        syncArticleTags(savedArticle, dto.tags());
    }

    public void deleteArticle(int articleId, String username) {
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new RuntimeException("Article not found"));

        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (currentUser.getRole().equals("ADMIN")) {
            articleRepository.delete(article);
            return;
        }

        if (
                currentUser.getRole().equals("EDITOR")
                        && article.getWriter().getUserId() == currentUser.getUserId()
        ) {
            articleRepository.delete(article);
            return;
        }

        throw new RuntimeException("Forbidden");
    }

    public List<ArticleDTO> getPublishedArticlesByTag(String tagName) {
        return articleRepository.findPublishedByTagName(tagName)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public List<ArticleDTO> searchPublishedArticles(String q) {
        return articleRepository.searchPublished(q)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    private void syncArticleTags(Article article, List<TagDTO> tagDTOs) {
        List<ArticleTags> existingTags =
                articleTagsRepository.findByArticle_ArticleId(article.getArticleId());
        articleTagsRepository.deleteAll(existingTags);

        if (tagDTOs == null || tagDTOs.isEmpty()) {
            return;
        }

        for (TagDTO tagDTO : tagDTOs) {
            if (tagDTO == null || tagDTO.tagName() == null || tagDTO.tagName().trim().isBlank()) {
                continue;
            }

            Tag tag = findOrCreateTag(tagDTO.tagName());

            ArticleTags articleTag = new ArticleTags();
            articleTag.setId(new ArticleTagsId(article.getArticleId(), tag.getTagName()));
            articleTag.setArticle(article);
            articleTag.setTag(tag);

            articleTagsRepository.save(articleTag);
        }
    }

    private Tag findOrCreateTag(String tagName) {
        String normalized = tagName.trim();

        return tagRepository.findAll()
                .stream()
                .filter(tag -> tag.getTagName() != null &&
                        tag.getTagName().equalsIgnoreCase(normalized))
                .findFirst()
                .orElseGet(() -> {
                    Tag newTag = new Tag();
                    newTag.setTagName(normalized);
                    return tagRepository.save(newTag);
                });
    }
    public List<ArticleDTO> getMyArticles(String username) {
        return articleRepository.findAll()
                .stream()
                .filter(article -> article.getWriter() != null
                        && username.equals(article.getWriter().getUsername()))
                .filter(article -> !"PUBLISHED".equals(article.getStatus()))
                .map(this::toDTO)
                .toList();
    }

    public ArticleDTO getArticleForEdit(int articleId, String username) {

        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new RuntimeException("Article not found"));

        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isAdmin = "ADMIN".equals(currentUser.getRole());
        boolean isOwner = article.getWriter().getUserId() == currentUser.getUserId();

        if (!isAdmin && !isOwner) {
            throw new RuntimeException("Forbidden");
        }

        return toDTO(article);
    }
}