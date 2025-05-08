import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Pagesdetails } from './pagesdetails.model';

@Injectable({
  providedIn: 'root'
})
export class PagesdetailsService {
  readonly baseUrl = 'https://localhost:7139/api'; // API endpoint
  pagesDetailsList: Pagesdetails[] = []; // Holds the fetched data

  constructor(private http: HttpClient) {}

  // Fetch user data and construct full profilePictureUrl
  refreshList(): void {
    const serverBaseUrl = 'https://localhost:7139'; // Base server URL for static files
    this.http.get<Pagesdetails[]>(this.baseUrl+"/user").pipe(
      map((data: Pagesdetails[]) =>
        data.map((user: Pagesdetails) => {
          const constructedProfilePictureUrl = `${serverBaseUrl}/${user.profilePictureUrl.replace(/\\/g, '/')}`;
          const constructedPhotosUrl = user.photosUrl.map(photo =>
            `${serverBaseUrl}/${photo.replace(/\\/g, '/')}`
          ); // Construct full URLs for each photo
          console.log('Constructed Profile Picture URL:', constructedProfilePictureUrl);
          console.log('Constructed Photos URLs:', constructedPhotosUrl);
          return {
            ...user,
            profilePictureUrl: constructedProfilePictureUrl,
            photosUrl: constructedPhotosUrl, // Update photosUrl with constructed URLs
          };
        })
      )
    ).subscribe((data: Pagesdetails[]) => {
      this.pagesDetailsList = data; // Update the list
      console.log('List refreshed:', this.pagesDetailsList); // Debugging log
    });
  }

  uploadProfilePicture(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
  
    return this.http.post<string>(`${this.baseUrl}/upload`, formData); // Adjust the endpoint as needed
  }
  
  updateUser(formData: FormData): Observable<any> {
    const url = `${this.baseUrl}/user/${formData.get('id')}`; // Use the id from FormData
    return this.http.put(url, formData); // Send the PUT request with FormData
  }
}