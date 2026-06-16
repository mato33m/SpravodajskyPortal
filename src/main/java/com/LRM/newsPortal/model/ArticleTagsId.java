package com.LRM.newsPortal.model;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class ArticleTagsId implements Serializable {
    private int articleId;
    private String tagName;
}