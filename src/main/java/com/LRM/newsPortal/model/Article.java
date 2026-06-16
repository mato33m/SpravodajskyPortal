package com.LRM.newsPortal.model;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;
import java.util.List;

@Entity
@Table(name = "article")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Article {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "article_id")
    private int articleId;

    @ManyToOne
    @JoinColumn(name = "writer_id")
    private User writer;

    @ManyToOne
    @JoinColumn(name = "topic_name")
    private Topic topic;

    @Column(name = "tags_id")
    private Integer tagsId;

    @Column(name = "release_date")
    private Timestamp releaseDate;

    @Column(name = "content")
    private String content;

    @Column(name = "status")
    private String status;

    @Column(name = "title")
    private String title;

    @Column(name = "image_url")
    private String imageUrl;

    @OneToMany(mappedBy = "article")
    private List<UserComment> comments;

    @OneToMany(mappedBy = "article")
    private List<ArticleTags> tags;
}