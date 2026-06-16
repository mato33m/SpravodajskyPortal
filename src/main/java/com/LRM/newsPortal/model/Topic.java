package com.LRM.newsPortal.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "topic")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Topic {

    @Id
    @Column(name = "topic_name")
    private String topicName;
}