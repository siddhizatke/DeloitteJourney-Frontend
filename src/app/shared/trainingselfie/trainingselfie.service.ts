

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Trainingselfie } from './trainingselfie.model';

@Injectable({
  providedIn: 'root'
})
export class TrainingselfieService {
  readonly baseUrl = 'https://localhost:7139/api';
  readonly serverBaseUrl = 'https://localhost:7139'; // Correct base URL for images

  constructor(private http: HttpClient) {}

  //fetch all training selfies
  TrainingselfieList(): Observable<Trainingselfie[]> {
    

    return this.http.get<Trainingselfie[]>(`${this.baseUrl}/TrainingSelfies`).pipe(
      map((data: Trainingselfie[]) =>
        data.map((TrainingS: Trainingselfie) => {
          // Replace backslashes with forward slashes
          const path = TrainingS.trainingImageUrl.replace(/\\/g, '/');
          // Encode only spaces and special characters
          const encodedPath = path.split('/').map(segment => encodeURIComponent(segment)).join('/');
          const constructedImageUrl = `${this.serverBaseUrl}${encodedPath}`;

          console.log('Constructed Profile Picture URL:', constructedImageUrl);

          return {
            ...TrainingS,
            trainingImageUrl: constructedImageUrl // Update trainingImageUrl with constructed URLs
          };
        })
      )
    );
  } 
   // Update an existing team selfie
  updateTrainingSelfie(id: number, formData: FormData): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/TrainingSelfies/${id}`, formData);
  }

  // Delete a team selfie
  deleteTrainingSelfie(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/TrainingSelfies/${id}`);
  }
}


