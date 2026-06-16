import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Article, Tag } from '../models/models';
import { ArticleService } from '../services/article.service';

@Component({
  selector: 'app-article-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './article-edit.html',
  styleUrl: './article-edit.css'
})
export class ArticleEdit implements OnInit {

  private articleService = inject(ArticleService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  articleId = 0;

  article: Article | null = null;

  tagInput = '';

  ngOnInit(): void {
    this.articleId = Number(this.route.snapshot.paramMap.get('id'));

    this.articleService.getArticleForEdit(this.articleId)
      .subscribe({
        next: article => {
          this.article = article;

          this.tagInput = (article.tags ?? [])
            .map(tag => tag.tagName)
            .join(', ');

          this.cdr.detectChanges();
        },
        error: err => {
          console.error(err);
          alert('Nepodarilo sa načítať článok.');
          this.router.navigate(['/articles']);
        }
      });
  }

  saveArticle() {
    if (!this.article) {
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

    const payload: Article = {
      ...this.article,
      tags,
      tagsId: null
    };

    this.articleService.updateArticle(this.articleId, payload)
      .subscribe({
        next: () => {
          alert('Článok bol upravený.');
          this.router.navigate(['/articles', this.articleId]);
        },
        error: err => {
          console.error(err);
          alert('Nepodarilo sa uložiť zmeny.');
        }
      });
  }
}
