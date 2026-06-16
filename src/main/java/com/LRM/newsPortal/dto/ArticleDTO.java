package com.LRM.newsPortal.dto;

import java.sql.Timestamp;
import java.util.List;

public record ArticleDTO(
        int articleId,
        UserDTO writer,
        String topicName,
        Integer tagsId,
        Timestamp releaseDate,
        String content,
        String status,
        String title,
        String imageUrl,
        List<UserCommentDTO> comments,
        List<TagDTO> tags
)
{ }