import { Component, inject, signal, OnInit } from '@angular/core';
import { Tag, Topic, User } from '../models/models';
import { TagsService } from '../services/tag.service';
import { TopicService } from '../services/topic.service';
import { UserService } from '../services/user.service';
import { NavbarComponent } from '../navbar/navbar';
import { TopicListComponent } from '../topic-list/topic-list';
import { TagListComponent } from '../tag-list/tag-list';
import { UserListComponent } from '../user-list/user-list';
import { ArticleReviewComponent } from '../article-review/article-review';

@Component({
  selector: 'app-admin-screen',
  standalone: true,
  imports: [
    NavbarComponent,
    TopicListComponent,
    TagListComponent,
    UserListComponent,
    ArticleReviewComponent
  ],
  templateUrl: './admin-screen.html',
  styleUrl: './admin-screen.css',
})
export class AdminScreen implements OnInit {

  tagsService = inject(TagsService);
  topicsService = inject(TopicService);
  userService = inject(UserService);

  tags = signal<Tag[]>([]);
  topics = signal<Topic[]>([]);
  users = signal<User[]>([]);
  activeTab = signal<'articles' | 'topics' | 'tags' | 'users'>('articles');

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.tagsService.getTags().subscribe(tags => this.tags.set(tags));
    this.topicsService.getTopics().subscribe(topics => this.topics.set(topics));
    this.userService.getUsers().subscribe(users => this.users.set(users));
  }

  // ── TOPIC HANDLERS ────────────────────────────────────────

  onTopicCreated(topicName: string) {
    this.topicsService.createTopic({ topicName }).subscribe(() =>
      this.topicsService.getTopics().subscribe(topics => this.topics.set(topics))
    );
  }

  onTopicUpdated(event: { old: string; newName: string }) {
    this.topicsService.updateTopic(event.old, { topicName: event.newName }).subscribe(() =>
      this.topicsService.getTopics().subscribe(topics => this.topics.set(topics))
    );
  }

  onTopicDeleted(topicName: string) {
    this.topicsService.deleteTopic(topicName).subscribe(() =>
      this.topicsService.getTopics().subscribe(topics => this.topics.set(topics))
    );
  }

  // ── TAG HANDLERS ──────────────────────────────────────────

  onTagCreated(tagName: string) {
    this.tagsService.createTag({ tagName }).subscribe(() =>
      this.tagsService.getTags().subscribe(tags => this.tags.set(tags))
    );
  }

  onTagUpdated(event: { old: string; newName: string }) {
    this.tagsService.updateTag(event.old, { tagName: event.newName }).subscribe(() =>
      this.tagsService.getTags().subscribe(tags => this.tags.set(tags))
    );
  }

  onTagDeleted(tagName: string) {
    this.tagsService.deleteTag(tagName).subscribe(() =>
      this.tagsService.getTags().subscribe(tags => this.tags.set(tags))
    );
  }

  // ── USER HANDLERS ─────────────────────────────────────────

  onUserDeleted(userId: number) {
    this.userService.deleteUser(userId).subscribe(() =>
      this.userService.getUsers().subscribe(users => this.users.set(users))
    );
  }

  onUserBanned(userId: number) {
    const user = this.users().find(u => u.userId === userId);
    if (!user) return;
    this.userService.updateUser(userId, { ...user, banned: true }).subscribe(() =>
      this.userService.getUsers().subscribe(users => this.users.set(users))
    );
  }

  onUserUnbanned(userId: number) {
    const user = this.users().find(u => u.userId === userId);
    if (!user) return;
    this.userService.updateUser(userId, { ...user, banned: false }).subscribe(() =>
      this.userService.getUsers().subscribe(users => this.users.set(users))
    );
  }

  onRoleChanged(event: { userId: number; role: string }) {
    const user = this.users().find(u => u.userId === event.userId);
    if (!user) return;
    this.userService.updateUser(event.userId, { ...user, role: event.role }).subscribe(() =>
      this.userService.getUsers().subscribe(users => this.users.set(users))
    );
  }
}
