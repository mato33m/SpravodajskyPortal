import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Article } from '../models/models';
import { ArticleService } from '../services/article.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-article-review',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './article-review.html',
  styleUrl: './article-review.css'
})
export class ArticleReviewComponent implements OnInit {

  articleService = inject(ArticleService);
  auth = inject(AuthService);

  articles = signal<Article[]>([]);
  loading = signal(true);
  error = signal('');
  filterStatus = signal<'ALL' | 'CONCEPT' | 'PUBLISHED' | 'REJECTED'>('ALL');
  actionInProgress = signal<number | null>(null);

  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles(): void {
    this.loading.set(true);
    this.error.set('');
    this.articleService.getArticles().subscribe({
      next: articles => {
        this.articles.set(articles);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Nepodarilo sa načítať články.');
        this.loading.set(false);
      }
    });
  }

  get filtered(): Article[] {
    const status = this.filterStatus();
    if (status === 'ALL') return this.articles();
    return this.articles().filter(a => a.status === status);
  }

  countByStatus(status: string): number {
    return this.articles().filter(a => a.status === status).length;
  }

  publish(article: Article): void {
    this.setStatus(article, 'PUBLISHED');
  }

  reject(article: Article): void {
    this.setStatus(article, 'REJECTED');
  }

  setDraft(article: Article): void {
    this.setStatus(article, 'CONCEPT');
  }

  private setStatus(article: Article, newStatus: string): void {
    this.actionInProgress.set(article.articleId);

    const payload: Partial<Article> = {
      articleId: article.articleId,
      writer: article.writer,
      topicName: article.topicName,
      tagsId: article.tagsId ?? null,
      releaseDate: article.releaseDate,
      content: article.content,
      status: newStatus,
      title: article.title,
      imageUrl: article.imageUrl ?? '',
      comments: article.comments ?? [],
      tags: article.tags ?? []
    };

    this.articleService.updateArticle(article.articleId, payload).subscribe({
      next: () => {
        this.articles.update(list =>
          list.map(a =>
            a.articleId === article.articleId ? { ...a, status: newStatus } : a
          )
        );
        this.actionInProgress.set(null);
      },
      error: () => {
        this.error.set('Nepodarilo sa zmeniť stav článku.');
        this.actionInProgress.set(null);
      }
    });
  }

  deleteArticle(article: Article): void {
    if (!confirm(`Naozaj chcete zmazať článok „${article.title}"?`)) return;
    this.actionInProgress.set(article.articleId);
    this.articleService.deleteArticle(article.articleId).subscribe({
      next: () => {
        this.articles.update(list => list.filter(a => a.articleId !== article.articleId));
        this.actionInProgress.set(null);
      },
      error: () => {
        this.error.set('Nepodarilo sa zmazať článok.');
        this.actionInProgress.set(null);
      }
    });
  }

  statusLabel(status: string): string {
    switch (status) {
      case 'PUBLISHED': return 'Zverejnený';
      case 'CONCEPT': return 'Koncept';
      case 'REJECTED': return 'Zamietnutý';
      default: return status;
    }
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('sk-SK', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  }
}
