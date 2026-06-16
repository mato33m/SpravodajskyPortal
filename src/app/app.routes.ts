import { authGuard } from './auth.guard';
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { ArticleListComponent } from './article-list/article-list';
import { ArticleDetailComponent } from './article-detail/article-detail';
import { AdminScreen } from './admin-screen/admin-screen';
import { UserProfile } from './user-profile/user-profile';
import { CreateArticle } from './create-article/create-article';
import { ArticleEdit } from './article-edit/article-edit';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'articles', component: ArticleListComponent },
  { path: 'articles/:id', component: ArticleDetailComponent },

  {
    path: 'admin-screen',
    component: AdminScreen,
    canActivate: [authGuard(['ADMIN'])]
  },

  {
    path: 'create-article',
    component: CreateArticle,
    canActivate: [authGuard(['ADMIN', 'EDITOR'])]
  },


  {
    path: 'edit-article/:id',
    component: ArticleEdit,
    canActivate: [authGuard(['ADMIN', 'EDITOR'])]
  },

  {
    path: 'user/:id',
    component: UserProfile,
    canActivate: [authGuard(['ADMIN', 'EDITOR', 'USER', 'READER'])]
  }
];
