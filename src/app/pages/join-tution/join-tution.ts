import { Component, ChangeDetectionStrategy, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirestoreDocService } from '../../services/fire/firestore-doc.service';
import { ClassDoc } from '../../models/fire/docs.model';

@Component({
  selector: 'join-tution',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './join-tution.html',
  styleUrls: ['./join-tution.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JoinTution {
  @Input() banner = '/assets/fam-problem.jpg';
  @Input() title = 'Chapter 1: Solar System';
  @Input() teacher = 'Arjun Kumar';
  @Input() students = 143;
  @Input() rating = 4.7;

  @Input() description = `
    Learn the complete Solar System with visual explanations and interactive examples.
    Perfect for Class 5 students. Covers NCERT & ICSE syllabus.
  `;
  joinLink = 'https://us04web.zoom.us/j/72047864567?pwd=iPTbcLLnhhoj0pHgEass0Q6IvdltGd.1'; // <— change this

  className = signal('Maths – Algebra Basics');
  duration = signal('1h 30m');

  constructor(private docs: FirestoreDocService) {
    this.docs.getOnce<ClassDoc>('classes', '27PYrAjjfBfpaTGXMd2W').subscribe((data) => {
      console.log('came');
      console.log(data);
    });
  }

  async goToJoin() {
    window.open(this.joinLink, '_blank');
  }

  async shareClass() {
    const shareData = {
      title: this.className(),
      text: `Join ${this.className()} by ${this.teacher}`,
      url: this.joinLink,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (e) {
        console.error(e);
      }
    } else {
      await navigator.clipboard.writeText(this.joinLink);
      alert('Link copied to clipboard!');
    }
  }
}
