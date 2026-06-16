package com.LRM.newsPortal.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tag")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Tag {

    @Id
    @Column(name = "tag_name")
    private String tagName;
}