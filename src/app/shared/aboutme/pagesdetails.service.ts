import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Pagesdetails, PagesdetailsPhotos } from './pagesdetails.model';

@Injectable({
  providedIn: 'root'
})
export class PagesdetailsService {
  private photosListSubject = new BehaviorSubject<PagesdetailsPhotos[]>([]);
  public photosList$ = this.photosListSubject.asObservable();
  readonly baseUrl = 'https://localhost:7139/api'; // API endpoint
  pagesDetailsList: Pagesdetails[] = []; // Holds the fetched data
  PagesdetailsPhotosList: PagesdetailsPhotos[] = []; // Holds the fetched data for photos

  constructor(private http: HttpClient) {}

  // Refresh the list of user details by fetching data from the server
  refreshList(): void {
    const serverBaseUrl = 'https://localhost:7139'; // Base server URL for static files
    this.http.get<Pagesdetails[]>(this.baseUrl + "/user").pipe(
      map((data: Pagesdetails[]) =>
        data.map((user: Pagesdetails) => {
          const constructedProfilePictureUrl = `${serverBaseUrl}${user.profilePictureUrl.replace(/\\/g, '/')}`;
          console.log('Constructed Profile Picture URL:', constructedProfilePictureUrl);
          return {
            ...user,
            profilePictureUrl: constructedProfilePictureUrl,
          };
        })
      )
    ).subscribe((data: Pagesdetails[]) => {
      this.pagesDetailsList = data; // Update the list with fetched data
      console.log('List refreshed:', this.pagesDetailsList); // Debugging log
    });
  }

  // Refresh the list of user photos by fetching data from the server
  refreshPhotoList(): void {
    const serverBaseUrl = 'https://localhost:7139'; // Base server URL for static files
    this.http.get<PagesdetailsPhotos[]>(`${this.baseUrl}/UserPhotos`).subscribe(
      (data: PagesdetailsPhotos[]) => {
        console.log('Raw API Response:', data); // Log the raw response
        this.PagesdetailsPhotosList = data.map(photo => {
          if (photo.photoUrl) { // Check for valid photo URL
            return {
              ...photo,
              photoUrl: `${serverBaseUrl}${photo.photoUrl.replace(/\\/g, '/')}`
            };
          } else {
            console.warn('Missing photoUrl for photo:', photo);
            return null; // Return null for invalid entries
          }
        }).filter(photo => photo !== null); // Filter out invalid entries
        console.log('Processed PagesdetailsPhotosList:', this.PagesdetailsPhotosList);
      },
      (error: any) => {
        console.error('Error fetching data:', error); // Log any errors
      }
    );
  }

  // Upload a profile picture to the server
  uploadProfilePicture(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<string>(`${this.baseUrl}/upload`, formData); // Send POST request to upload the file
  }

  // Update user details on the server
  updateUser(formData: FormData): Observable<any> {
    const url = `${this.baseUrl}/user/${formData.get('id')}`; // Construct URL using the user ID from FormData
    return this.http.put(url, formData); // Send PUT request with FormData to update user details
  }
}
