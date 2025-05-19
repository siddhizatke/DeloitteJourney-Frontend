import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Teamselfie } from './teamselfie.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TeamselfieService {
  [x: string]: any;
  constructor(private http: HttpClient) {}

  TeamSelfieList(): Observable<Teamselfie[]> {
      return this.http.get<Teamselfie[]>(`${environment.apiBaseUrl}/TeamSelfies`).pipe(
        map((data: Teamselfie[]) =>
          data.map((TeamS: Teamselfie) => {
             console.log('TeamSelfieList:', TeamS);
            // If you want to modify TrainingS, do it here and return the new object.
            // For now, just return TrainingS as is.
            return TeamS;
           
          })
        )
      );
    } 

    getTeamSelfies(): Observable<Teamselfie[]> {
    return this.http.get<Teamselfie[]>(`${environment.apiBaseUrl}/teamselfies`);
    }

  // Add a new team selfie
  addTeamSelfie(teamselfieDescription: string, teamImage: File): Observable<Teamselfie> {
    const formData = new FormData();
    formData.append('TeamDescription', teamselfieDescription);
    formData.append('TeamImage', teamImage);

    return this.http.post<Teamselfie>(`${environment.apiBaseUrl}/TeamSelfies`, formData);
  }

  // Update an existing team selfie
  updateTeamSelfie(id: number, formData: FormData): Observable<void> {
    return this.http.put<void>(`${environment.apiBaseUrl}/TeamSelfies/${id}`, formData);
  }

  // Delete a team selfie
  deleteTeamSelfie(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiBaseUrl}/TeamSelfies/${id}`);
  }
}
