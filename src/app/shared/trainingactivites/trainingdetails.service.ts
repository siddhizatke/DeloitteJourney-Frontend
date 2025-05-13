import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrainingdetailsService {
  readonly baseUrl = 'https://localhost:7139/api/Training';
  trainingActivitiesList: any[] = [];

  constructor(private http: HttpClient) {}

  // Fetch all training activities from the server
  refreshTrainingActivitiesList(): void {
    this.http.get<any[]>(this.baseUrl).subscribe(
      (data) => {
        this.trainingActivitiesList = data;
        console.log('Training Activities List refreshed:', this.trainingActivitiesList);
      },
      (error) => {
        console.error('Error fetching training activities:', error);
      }
    );
  }

 
}