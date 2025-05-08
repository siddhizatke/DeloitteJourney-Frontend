import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TrainingselfieService } from '../../shared/trainingselfie/trainingselfie.service' // Ensure the correct path
import { Inject } from '@angular/core'; // Import Inject decorator
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Trainingselfie } from '../../shared/trainingselfie/trainingselfie.model';

@Component({
  selector: 'app-trainingselfie',
  templateUrl: './trainingselfie.component.html',
  imports:[CommonModule],
  styleUrls: ['./trainingselfie.component.css']
})
export class TrainingselfieComponent implements OnInit {

  trainingselfieList: Trainingselfie[] = []; // Initialize the list
  constructor(private trainingselfieService: TrainingselfieService,
    @Inject(ChangeDetectorRef) private cdr: ChangeDetectorRef) {} // Inject the service

  ngOnInit(): void {
    this.trainingselfieService.TrainingselfieList().subscribe(
      (data: Trainingselfie[]) => {
        console.log('Data fetched from API:', data);
        this.trainingselfieList = data; // Assign the list
        this.cdr.detectChanges(); // Trigger change detection
        console.log('Training Activities List:', this.trainingselfieList);
      },
      (error) => {
        console.error('Error fetching training activities:', error);
      }
    );
  }
}