import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Teamselfie } from './teamselfie.model';

@Injectable({
  providedIn: 'root'
})
export class TeamselfieService {
  readonly baseUrl = 'https://localhost:7139'; // Adjust the port if necessary
  readonly serverUrl = 'https://localhost:7139/api/TeamSelfies';

  constructor(private http: HttpClient) {}

  // Fetch all team selfies
  TeamselfieList(): Observable<Teamselfie[]> {
    return this.http.get<Teamselfie[]>(`${this.serverUrl}`).pipe(
      map((data: Teamselfie[]) =>
        data.map((TeamS: Teamselfie) => {
          // Replace backslashes with forward slashes
          const path = TeamS.teamImageUrl.replace(/\\/g, '/');
          // Encode only spaces and special characters
          const encodedPath = path.split('/').map(segment => encodeURIComponent(segment)).join('/');
          const constructedImageUrl = `${this.baseUrl}${encodedPath}`;

          console.log('Constructed Image URL:', constructedImageUrl);

          return {
            ...TeamS,
            teamImageUrl: constructedImageUrl // Update trainingImageUrl with constructed URLs
          };
        })
      )
    );
  }

  // Add a new team selfie
  addTeamSelfie(teamselfieDescription: string, teamImage: File): Observable<Teamselfie> {
    const formData = new FormData();
    formData.append('TeamDescription', teamselfieDescription);
    formData.append('TeamImage', teamImage);

    return this.http.post<Teamselfie>(this.serverUrl, formData);
  }

  // Update an existing team selfie
  updateTeamSelfie(id: number, formData: FormData): Observable<void> {
    return this.http.put<void>(`${this.serverUrl}/${id}`, formData);
  }

  // Delete a team selfie
  deleteTeamSelfie(id: number): Observable<void> {
    return this.http.delete<void>(`${this.serverUrl}/${id}`);
  }
}
