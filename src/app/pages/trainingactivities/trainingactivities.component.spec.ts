import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingactivitiesComponent } from './trainingactivities.component';

describe('TrainingactivitiesComponent', () => {
  let component: TrainingactivitiesComponent;
  let fixture: ComponentFixture<TrainingactivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainingactivitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainingactivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
