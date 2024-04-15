import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusDetailsPage } from './status-details.page';

describe('StatusDetailsPage', () => {
  let component: StatusDetailsPage;
  let fixture: ComponentFixture<StatusDetailsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(StatusDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
