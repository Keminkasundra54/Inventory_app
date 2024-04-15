import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IpConfigPage } from './ip-config.page';

describe('IpConfigPage', () => {
  let component: IpConfigPage;
  let fixture: ComponentFixture<IpConfigPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(IpConfigPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
