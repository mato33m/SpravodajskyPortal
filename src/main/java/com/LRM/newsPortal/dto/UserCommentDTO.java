package com.LRM.newsPortal.dto;

public record UserCommentDTO(
        int id,
        int articleId,
        int authorId,
        String content,
        int rating
) { }