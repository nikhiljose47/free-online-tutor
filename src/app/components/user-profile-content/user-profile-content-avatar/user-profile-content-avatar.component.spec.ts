import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileContentAvatarComponent } from './user-profile-content-avatar.component';

describe('UserProfileContentAvatarComponent', () => {
  let component: UserProfileContentAvatarComponent;
  let fixture: ComponentFixture<UserProfileContentAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProfileContentAvatarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserProfileContentAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
