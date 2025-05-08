import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingselfieComponent } from './trainingselfie.component';

describe('TrainingselfieComponent', () => {
  let component: TrainingselfieComponent;
  let fixture: ComponentFixture<TrainingselfieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainingselfieComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainingselfieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
