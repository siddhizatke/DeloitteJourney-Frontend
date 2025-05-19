
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, BehaviorSubject } from 'rxjs';
import { Trainingselfie } from './trainingselfie.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrainingselfieService {
  trainingselfieList: Trainingselfie[] = [];
  constructor(private http: HttpClient) {}

  TrainingselfieList(): Observable<Trainingselfie[]> {
    return this.http.get<Trainingselfie[]>(`${environment.apiBaseUrl}/TrainingSelfies`).pipe(
      map((data: Trainingselfie[]) =>
        data.map((TrainingS: Trainingselfie) => {
          // If you want to modify TrainingS, do it here and return the new object.
          // For now, just return TrainingS as is.
          return TrainingS;
        })
      )
    );
  } 

  getTrainingSelfie(): Observable<Trainingselfie[]> {
      return this.http.get<Trainingselfie[]>(`${environment.apiBaseUrl}/TrainingSelfies`);
      }
   // Update an existing team selfie
  updateTrainingSelfie(id: number, formData: FormData): Observable<void> {
    return this.http.put<void>(`${environment.apiBaseUrl}/TrainingSelfies/${id}`, formData);
  }

  
  // Delete a team selfie
  deleteTrainingSelfie(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiBaseUrl}/TrainingSelfies/${id}`);
  }
}


