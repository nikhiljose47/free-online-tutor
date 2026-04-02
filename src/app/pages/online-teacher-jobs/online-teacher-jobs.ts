import { Component } from '@angular/core';
import { TEACHER_JOB_FORM_URL } from '../../core/constants/app.constants';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'online-teacher-jobs',
  imports: [CommonModule],
  templateUrl: './online-teacher-jobs.html',
  styleUrl: './online-teacher-jobs.scss',
})
export class OnlineTeacherJobs {
  formUrl = TEACHER_JOB_FORM_URL;
}
