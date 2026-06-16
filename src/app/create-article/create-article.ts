import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Article, Tag, User } from '../models/models';
import { ArticleService } from '../services/article.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-create-article',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './create-article.html',
  styleUrl: './create-article.css'
})
export class CreateArticle {

  private articleService = inject(ArticleService);
  private authService = inject(AuthService);
  private router = inject(Router);

  tagInput = '';

  article: Partial<Article> = {
    title: '',
    content: '',
    imageUrl: '',
    topicName: 'Technology',
    status: 'CONCEPT',
    comments: [],
    tags: []
  };

  createArticle() {
    const user = this.authService.currentUser();

    if (!user) {
      alert('Musíš byť prihlásený.');
      return;
    }

    const tags: Tag[] = this.tagInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
      .filter((tag, index, arr) =>
        arr.findIndex(t => t.toLowerCase() === tag.toLowerCase()) === index
      )
      .map(tagName => ({ tagName }));

    const articleToSend: Partial<Article> = {
      ...this.article,
      articleId: 0,
      writer: user as User,
      tagsId: null,
      releaseDate: '',
      tags
    };

    console.log('ARTICLE TO SEND', articleToSend);

    this.articleService.createArticle(articleToSend)
      .subscribe({
        next: () => {
          alert('Článok bol úspešne vytvorený');
          this.router.navigate(['/articles']);
        },
        error: err => {
          console.error(err);
          alert('Nepodarilo sa vytvoriť článok');
        }
      });
  }
}
