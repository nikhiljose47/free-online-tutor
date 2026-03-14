import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/fire/auth.service';
import { Router } from '@angular/router';
import { Auth2Service } from '../../core/services/fire/auth2.service';
import { Toast } from '../../components/toast/toast';
import { ToastService } from '../../shared/toast.service';
import { AuthPanelComponent } from '../../shared/components/auth-panel.component/auth-panel.component';

@Component({
  selector: 'login',
  standalone: true,
  imports: [CommonModule, AuthPanelComponent],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {}
