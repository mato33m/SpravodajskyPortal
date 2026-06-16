import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ArticleService } from '../services/article.service';
import { Article, Topic, Tag } from '../models/models';
import { NavbarComponent } from '../navbar/navbar';
import { TagsService } from '../services/tag.service';
import { TopicService } from '../services/topic.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  templateUrl: './article-list.html',
  styleUrl: './article-list.css'
})
export class ArticleListComponent implements OnInit {

  private articleService = inject(ArticleService);
  private tagService = inject(TagsService);
  private topicService = inject(TopicService);
  auth = inject(AuthService);

  articles = signal<Article[]>([]);
  myArticles = signal<Article[]>([]);
  topics = signal<Topic[]>([]);
  tags = signal<Tag[]>([]);

  topicId = signal<string | null>(null);
  selectedTags = signal<string[]>([]);

  q = '';

  ngOnInit() {
    queueMicrotask(() => {
      this.loadMeta();
      this.load();
      this.loadMyArticles();
    });
  }

  isEditor(): boolean {
    const role = this.auth.currentUser()?.role;
    return role === 'EDITOR' || role === 'ADMIN';
  }

  loadMeta() {
    this.topicService.getTopics().subscribe(t => this.topics.set(t));
    this.tagService.getTags().subscribe(t => this.tags.set(t));
  }

  load() {
    this.articleService.getPublishedArticles().subscribe((data: Article[]) => {
      let articles: Article[] = data;

      const topic = this.topicId();
      const selectedTags = this.selectedTags();
      const q = this.q.trim().toLowerCase();

      if (topic) {
        articles = articles.filter(a => a.topicName === topic);
      }

      if (selectedTags.length > 0) {
        articles = articles.filter(a =>
          selectedTags.every(tag =>
            a.tags.some(articleTag => articleTag.tagName === tag)
          )
        );
      }

      if (q) {
        articles = articles.filter(a =>
          a.title.toLowerCase().includes(q) ||
          a.content.toLowerCase().includes(q)
        );
      }

      this.articles.set(articles);
    });
  }

  loadMyArticles() {
    if (!this.isEditor()) {
      this.myArticles.set([]);
      return;
    }

    this.articleService.getMyArticles().subscribe({
      next: data => this.myArticles.set(data),
      error: () => this.myArticles.set([])
    });
  }

  setTopic(name?: string) {
    this.topicId.set(name ?? null);
    this.load();
  }

  toggleTag(name: string) {
    const current = this.selectedTags();
    const exists = current.includes(name);

    if (exists) {
      this.selectedTags.set(current.filter(tag => tag !== name));
    } else {
      this.selectedTags.set([...current, name]);
    }

    this.load();
  }

  clearTags() {
    this.selectedTags.set([]);
    this.load();
  }

  onSearchInput() {
    this.load();
  }

  fmt(date: string) {
    return new Date(date).toLocaleString('sk-SK');
  }

  topicLabel(name: string): string {
    switch (name) {
      case 'Science':
        return 'Veda';
      case 'Technology':
        return 'Technika';
      case 'History':
        return 'História';
      case 'World News':
        return 'Svetové novinky';
      default:
        return name;
    }
  }

  statusLabel(status: string): string {
    switch (status) {
      case 'CONCEPT':
        return 'Koncept';
      case 'REJECTED':
        return 'Zamietnutý';
      case 'PUBLISHED':
        return 'Zverejnený';
      default:
        return status;
    }
  }


  isTagSelected(tagName: string): boolean {
    return this.selectedTags().includes(tagName);
  }
}
