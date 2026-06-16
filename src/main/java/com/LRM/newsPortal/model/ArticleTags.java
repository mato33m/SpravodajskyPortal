package com.LRM.newsPortal.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "articletags")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class ArticleTags {

    @EmbeddedId
    private ArticleTagsId id;

    @ManyToOne
    @MapsId("articleId")
    @JoinColumn(name = "article_id")
    private Article article;

    @ManyToOne
    @MapsId("tagName")
    @JoinColumn(name = "tag_name")
    private Tag tag;
}