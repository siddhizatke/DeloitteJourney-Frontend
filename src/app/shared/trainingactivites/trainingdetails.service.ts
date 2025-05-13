import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrainingdetailsService {
 
  trainingActivitiesList: any[] = [];

  constructor(private http: HttpClient) {}

  // Fetch all training activities from the server
  refreshTrainingActivitiesList(): void {
    this.http.get<any[]>(`${environment.apiBaseUrl}/Training`).subscribe(
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