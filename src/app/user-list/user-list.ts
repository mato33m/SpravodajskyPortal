import {Component, Input, Output, EventEmitter, ViewEncapsulation} from '@angular/core';
import { User } from '../models/models';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
  encapsulation: ViewEncapsulation.None,
})
export class UserListComponent {

  @Input() users: User[] = [];
  @Output() deleted = new EventEmitter<number>();
  @Output() banned = new EventEmitter<number>();
  @Output() unbanned = new EventEmitter<number>();
  @Output() roleChanged = new EventEmitter<{ userId: number; role: string }>();

  onDelete(userId: number) {
    this.deleted.emit(userId);
  }

  onBan(userId: number) {
    this.banned.emit(userId);
  }

  onUnban(userId: number) {
    this.unbanned.emit(userId);
  }

  onRoleChange(userId: number, role: string) {
    this.roleChanged.emit({ userId, role });
  }
}
