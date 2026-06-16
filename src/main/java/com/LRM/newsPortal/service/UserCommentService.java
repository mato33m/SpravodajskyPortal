package com.LRM.newsPortal.service;

import com.LRM.newsPortal.dto.UserCommentDTO;
import com.LRM.newsPortal.model.UserComment;
import com.LRM.newsPortal.model.Article;
import com.LRM.newsPortal.model.User;
import com.LRM.newsPortal.repository.UserCommentRepository;
import com.LRM.newsPortal.repository.ArticleRepository;
import com.LRM.newsPortal.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserCommentService {

    private static final Logger log = LoggerFactory.getLogger(UserCommentService.class);

    private final UserCommentRepository userCommentRepository;
    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;

    public UserCommentService(UserCommentRepository userCommentRepository,
                              ArticleRepository articleRepository,
                              UserRepository userRepository) {
        this.userCommentRepository = userCommentRepository;
        this.articleRepository = articleRepository;
        this.userRepository = userRepository;
    }

    public UserCommentDTO getCommentById(int commentId) {
        UserComment comment = userCommentRepository.findById(commentId).orElse(null);

        if (comment == null) return null;

        return new UserCommentDTO(
                comment.getCommentId(),
                comment.getArticle().getArticleId(),
                comment.getAuthor().getUserId(),
                comment.getContent(),
                comment.getRating()
        );
    }

    public List<UserCommentDTO> getAllComments() {
        return userCommentRepository.findAll()
                .stream()
                .map(c -> new UserCommentDTO(
                        c.getCommentId(),
                        c.getArticle().getArticleId(),
                        c.getAuthor().getUserId(),
                        c.getContent(),
                        c.getRating()
                ))
                .toList();
    }

    public void createComment(UserCommentDTO dto, String username) {
        Article article = articleRepository.findById(dto.articleId())
                .orElseThrow(() -> new RuntimeException("Article not found"));

        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserComment comment = new UserComment(
                0,
                author,
                article,
                dto.content(),
                dto.rating()
        );

        userCommentRepository.save(comment);

        log.info("Created comment for article {}", dto.articleId());
    }

    public void updateComment(int commentId, UserCommentDTO dto) {
        UserComment existing = userCommentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        Article article = articleRepository.findById(dto.articleId())
                .orElseThrow(() -> new RuntimeException("Article not found"));

        User author = userRepository.findById(dto.authorId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        existing.setAuthor(author);
        existing.setArticle(article);
        existing.setContent(dto.content());
        existing.setRating(dto.rating());

        userCommentRepository.save(existing);

        log.info("Updated comment {}", commentId);
    }

    public void deleteComment(int commentId) {
        userCommentRepository.deleteById(commentId);
        log.info("Deleted comment {}", commentId);
    }
}