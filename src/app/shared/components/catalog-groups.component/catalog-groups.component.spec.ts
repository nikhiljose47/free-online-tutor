import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogGroupsComponent } from './catalog-groups.component';

describe('CatalogGroupsComponent', () => {
  let component: CatalogGroupsComponent;
  let fixture: ComponentFixture<CatalogGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogGroupsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
