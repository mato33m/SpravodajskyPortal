import {Component, Input, Output, EventEmitter, ViewEncapsulation} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Topic } from '../models/models';

@Component({
  selector: 'app-topic-list',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './topic-list.html',
  styleUrl: './topic-list.css',
  encapsulation: ViewEncapsulation.None
})
export class TopicListComponent {

  @Input() topics: Topic[] = [];
  @Output() deleted = new EventEmitter<string>();
  @Output() updated = new EventEmitter<{ old: string; newName: string }>();
  @Output() created = new EventEmitter<string>();

  newTopicName: string = '';

  onAdd() {
    if (!this.newTopicName.trim()) return;
    this.created.emit(this.newTopicName);
    this.newTopicName = '';
  }

  onUpdate(oldName: string, newName: string) {
    if (!newName.trim() || newName === oldName) return;
    this.updated.emit({ old: oldName, newName });
  }

  onDelete(topicName: string) {
    this.deleted.emit(topicName);
  }
}
