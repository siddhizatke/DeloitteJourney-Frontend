import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Trainingselfie } from './trainingselfie.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrainingselfieService {
 

  constructor(private http: HttpClient) {}

  //fetch all training selfies
  TrainingselfieList(): Observable<Trainingselfie[]> {
    

    return this.http.get<Trainingselfie[]>(`${environment.apiBaseUrl}/TrainingSelfies`).pipe(
      map((data: Trainingselfie[]) =>
        data.map((TrainingS: Trainingselfie) => {
          // Replace backslashes with forward slashes
          const path = TrainingS.trainingImageUrl.replace(/\\/g, '/');
          // Encode only spaces and special characters
          const encodedPath = path.split('/').map(segment => encodeURIComponent(segment)).join('/');
          const constructedImageUrl = `${environment.serverBaseUrl}${encodedPath}`;

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
    return this.http.put<void>(`${environment.apiBaseUrl}/TrainingSelfies/${id}`, formData);
  }

  // Delete a team selfie
  deleteTrainingSelfie(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiBaseUrl}/TrainingSelfies/${id}`);
  }
}


