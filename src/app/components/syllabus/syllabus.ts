import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SyllabusService } from '../../services/syllabus.service';
import { SyllabusItem } from '../../models/syllabus.model';

@Component({
  selector: 'syllabus',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <h3 class="fw-bold mb-3">All Class Syllabus</h3>

      <div class="accordion" id="syllabusAcc">
        <div class="accordion-item" *ngFor="let group of grouped">
          <h2 class="accordion-header">
            <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              [attr.data-bs-target]="'#c' + group.class.replace(' ', '')"
            >
              {{ group.class }}
            </button>
          </h2>

          <div
            [id]="'c' + group.class.replace(' ', '')"
            class="accordion-collapse collapse"
            data-bs-parent="#syllabusAcc"
          >
            <div class="accordion-body">
              <div *ngFor="let s of group.items" class="mb-3">
                <h6 class="fw-bold">{{ s.subject }}</h6>
                <ul>
                  <li *ngFor="let t of s.topics">{{ t }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class SyllabusComponent {
  data: SyllabusItem[] = [];

  grouped = this.groupByClass(this.data);

  constructor(private service: SyllabusService) {
    this.data = this.service.getAll();
  }

  groupByClass(list: any[]) {
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
