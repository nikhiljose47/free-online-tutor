import { Component, ChangeDetectionStrategy, signal } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'join-tutor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './join-tutor.html',
  styleUrls: ['./join-tutor.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JoinTutor {

  // future: replace static iframe src with env-based dynamic form link if needed
  formUrl = signal('https://docs.google.com/forms/d/e/1FAIpQLSfdc532mfApDy0MyTY_eJhI-awJViiBlqPsk_QS2-XUxVcH0A/viewform')

}