import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SyllabusService } from '../../services/syllabus.service';
import { SyllabusItem } from '../../models/syllabus.model';

@Component({
  selector: 'syllabus',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './syllabus.html',
})
export class SyllabusComponent {
  grouped = signal<any[]>([]);   // Only this affects UI → must be a signal

  constructor(private service: SyllabusService) {
    const list = this.service.getAll();  // sync load

    // this will notify Angular to update UI (zoneless mode)
    this.grouped.set(this.groupByClass(list));
  }

  groupByClass(list: SyllabusItem[]) {
    const map: any = {};

    list.forEach((i) => {
      if (!map[i.class]) map[i.class] = [];
      map[i.class].push(i);
    });

    return Object.keys(map).map((c) => ({
      class: c,
      items: map[c],
    }));
  }
}
