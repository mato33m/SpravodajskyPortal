import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ArticleService } from '../services/article.service';
import { AuthService } from '../services/auth.service';
import { NavbarComponent } from '../navbar/navbar';

import { Article, UserComment } from '../models/models';
import { TagsService } from '../services/tag.service';
import { TopicService } from '../services/topic.service';
import { CommentService } from '../services/comment.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  templateUrl: './article-detail.html',
  styleUrl: './article-detail.css'
})
export class ArticleDetailComponent implements OnInit {

  private articleService = inject(ArticleService);
  private tagService = inject(TagsService);
  private topicService = inject(TopicService);
  private commentService = inject(CommentService);
  private userService = inject(UserService);

  auth = inject(AuthService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  article = signal<Article | null>(null);
  comments = signal<UserComment[]>([]);

  authorNames = signal<Record<number, string>>({});

  text = '';
  selectedRating = signal<number>(5); // Nový signál pre dynamický rating
  ok = signal(false);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.articleService.getArticle(id).subscribe({
      next: (a: Article) => {
        this.article.set(a);
        this.comments.set(a.comments ?? []);
        this.loadAuthorNames(a.comments ?? []);
      },
      error: () => {
        this.router.navigate(['/articles']);
      }
    });
  }

  private loadAuthorNames(comments: UserComment[]) {
    const uniqueIds = [...new Set(comments.map(c => c.authorId))];
    uniqueIds.forEach(authorId => {
      this.userService.getUser(authorId).subscribe({
        next: (user) => {
          this.authorNames.update(names => ({
            ...names,
            [authorId]: user.username
          }));
        },
        error: () => {}
      });
    });
  }

  getAuthorName(authorId: number): string {
    return this.authorNames()[authorId] ?? `User #${authorId}`;
  }

  fmt(iso: string) {
    return new Date(iso).toLocaleDateString('sk-SK', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  isAdmin(): boolean {
    return this.auth.currentUser()?.role?.toUpperCase() === 'ADMIN';
  }

  canEditArticle(): boolean {
    const user = this.auth.currentUser();
    const article = this.article();

    if (!user || !article) {
      return false;
    }

    if (user.role === 'ADMIN') {
      return true;
    }

    return (
      user.role === 'EDITOR' &&
      user.userId === article.writer.userId
    );
  }

  addComment() {
    const user = this.auth.currentUser();
    const article = this.article();

    if (!user || !article || !this.text.trim()) return;

    const currentRating = this.selectedRating();

    const newComment: Partial<UserComment> = {
      articleId: article.articleId,
      content: this.text.trim(),
      rating: currentRating
    };

    this.commentService.createComment(newComment).subscribe({
      next: () => {
        const updated: UserComment = {
          id: Date.now(),
          articleId: article.articleId,
          authorId: user.userId,
          content: this.text.trim(),
          rating: currentRating
        };

        this.comments.update(arr => [...arr, updated]);

        this.authorNames.update(names => ({
          ...names,
          [user.userId]: user.username
        }));

        this.text = '';
        this.selectedRating.set(5);
        this.ok.set(true);
        setTimeout(() => this.ok.set(false), 2000);
      }
    });
  }

  deleteComment(commentId: number) {
    this.commentService.deleteComment(commentId).subscribe({
      next: () => {
        this.comments.update(arr => arr.filter(c => c.id !== commentId));
      }
    });
  }

  banUser(userId: number) {
    this.userService.getUser(userId).subscribe(user => {
      this.userService.updateUser(userId, { ...user, banned: true }).subscribe();
    });
  }

  deleteArticle() {
    const article = this.article();

    if (!article) return;
    if (!confirm('Naozaj chcete zmazať tento článok?')) return;

    this.articleService.deleteArticle(article.articleId)
      .subscribe({
        next: () => {
          alert('Článok bol zmazaný.');
          this.router.navigate(['/articles']);
        },
        error: err => {
          console.error(err);
          alert('Nepodarilo sa zmazať článok.');
        }
      });
  }
}
