import {Component, Input, Output, EventEmitter, ViewEncapsulation} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Tag } from '../models/models';

@Component({
  selector: 'app-tag-list',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './tag-list.html',
  styleUrl: './tag-list.css',
  encapsulation: ViewEncapsulation.None
})
export class TagListComponent {

  @Input() tags: Tag[] = [];
  @Output() deleted = new EventEmitter<string>();
  @Output() updated = new EventEmitter<{ old: string; newName: string }>();
  @Output() created = new EventEmitter<string>();

  newTagName: string = '';

  onAdd() {
    if (!this.newTagName.trim()) return;
    this.created.emit(this.newTagName);
    this.newTagName = '';
  }

  onUpdate(oldName: string, newName: string) {
    if (!newName.trim() || newName === oldName) return;
    this.updated.emit({ old: oldName, newName });
  }

  onDelete(tagName: string) {
    this.deleted.emit(tagName);
  }
}
