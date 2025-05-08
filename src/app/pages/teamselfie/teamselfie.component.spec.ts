import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamselfieComponent } from './teamselfie.component';

describe('TeamselfieComponent', () => {
  let component: TeamselfieComponent;
  let fixture: ComponentFixture<TeamselfieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamselfieComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamselfieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
