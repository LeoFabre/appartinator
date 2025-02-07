import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteDetailsDialogComponent } from './route-details-dialog.component';

describe('RouteDetailsDialogComponent', () => {
  let component: RouteDetailsDialogComponent;
  let fixture: ComponentFixture<RouteDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouteDetailsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RouteDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
