import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { User } from '../models/models';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { NavbarComponent } from '../navbar/navbar';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [FormsModule, DatePipe, NavbarComponent],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile implements OnInit {

  userService = inject(UserService);
  authService = inject(AuthService);
  route = inject(ActivatedRoute);

  user = signal<User | null>(null);
  editing = signal(false);
  saving = signal(false);
  saveError = signal('');
  saveSuccess = signal(false);

  editForm: Partial<User> = {};

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.load(id);
    });
  }

  load(id: number): void {
    this.userService.getUser(id).subscribe((user: User) => {
      this.user.set(user);
    });
  }

  canEdit(): boolean {
    const current = this.authService.currentUser();
    if (!current) return false;
    return current.userId === this.user()?.userId
  }

  startEdit(): void {
    const u = this.user();
    if (!u) return;
    this.editForm = {
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      bio: u.bio,
      passwordHash: '',
    };
    this.saveError.set('');
    this.saveSuccess.set(false);
    this.editing.set(true);
  }

  cancelEdit(): void {
    this.editing.set(false);
    this.saveError.set('');
    this.saveSuccess.set(false);
  }

  saveEdit(u: User): void {
    this.saving.set(true);
    this.saveError.set('');
    this.saveSuccess.set(false);

    const payload: Partial<User> = {
      ...u,
      ...this.editForm,
    };

    // don't send empty password
    if (!this.editForm.passwordHash?.trim()) {
      delete payload.passwordHash;
    }

    this.userService.updateUser(u.userId, payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.saveSuccess.set(true);
        this.editing.set(false);
        this.load(u.userId);
      },
      error: () => {
        this.saving.set(false);
        this.saveError.set('Failed to save changes. You may not have permission.');
      }
    });
  }
}
