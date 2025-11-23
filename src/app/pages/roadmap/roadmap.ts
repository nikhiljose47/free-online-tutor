import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoadmapService } from '../../services/roadmap.service';

@Component({
  selector: 'roadmap',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <h3 class="fw-bold mb-3">Roadmaps</h3>

      <div *ngFor="let r of roadmaps" class="card mb-3 p-3">
        <div class="d-flex justify-content-between align-items-center">
          <div><h5>{{ r.className }}</h5></div>
          <div>{{ completedCount(r) }} / {{ r.nodes.length }} completed</div>
        </div>

        <div class="mt-3">
          <div class="d-flex gap-2 align-items-center">
            <ng-container *ngFor="let n of r.nodes">
              <div class="text-center" style="min-width: 140px;">
                <div [class.bg-success]="n.completed" [class.bg-secondary]="!n.completed"
                     class="rounded-pill text-white py-2 px-3">
                  {{ n.title }}
                </div>
                <div class="small text-muted mt-1">{{ n.hoursEstimate || 1 }}h</div>
              </div>
              <div *ngIf="!isLast(n, r)" style="width:20px; height:2px; background:#ddd;"></div>
            </ng-container>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RoadmapComponent {
  private svc = inject(RoadmapService);
  roadmaps = this.svc.getAll();

  completedCount(r:any) { return r.nodes.filter((n:any)=>n.completed).length; }
  isLast(n:any, r:any) { return r.nodes[r.nodes.length-1].id === n.id; }
}
