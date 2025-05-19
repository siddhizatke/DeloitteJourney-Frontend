import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Pagesdetails, PagesdetailsPhotos } from './aboutme.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PagesdetailsService {
  pagesDetailsList: Pagesdetails[] = [];
  private pagesDetailsListSubject = new BehaviorSubject<Pagesdetails[]>([]);
  public pagesDetailsList$ = this.pagesDetailsListSubject.asObservable();
  PagesdetailsPhotosList: PagesdetailsPhotos[] = [];
  private PagesdetailsPhotosListSubject = new BehaviorSubject<PagesdetailsPhotos[]>([]);
  photosList$: any;

  constructor(private http: HttpClient) {}

  refreshList(): void {
    this.http.get<Pagesdetails[]>(environment.apiBaseUrl + "/user")
      .subscribe((data: Pagesdetails[]) => {
        this.pagesDetailsList = data;
        this.pagesDetailsListSubject.next(data);
      });
  }

  refreshPhotoList(): void {
    this.http.get<PagesdetailsPhotos[]>(`${environment.apiBaseUrl}/UserPhotos`)
      .subscribe((photo: PagesdetailsPhotos[]) => {
        this.PagesdetailsPhotosList = photo;
        this.PagesdetailsPhotosListSubject.next(photo);
        console.log('PagesdetailsPhotosList in Service:', this.PagesdetailsPhotosList); // Debugging log
      });
  }
  updateUser(formData: FormData) {
    const url = `${environment.apiBaseUrl}/user/${formData.get('id')}`;
    return this.http.put(url, formData);
  }



 /*  refreshPhotoList(): void {
    //const serverBaseUrl = 'https://localhost:7139'; // Base server URL for static files
    this.http.get<PagesdetailsPhotos[]>(`${environment.apiBaseUrl}/UserPhotos`).subscribe(
      (data: PagesdetailsPhotos[]) => {
        console.log('Raw API Response:', data); // Log the raw response
        this.PagesdetailsPhotosList = data.map(photo => {
          if (photo.photoUrl) { // Check for valid photo URL
            return {
              ...photo,
              photoUrl: `${environment.serverBaseUrl}${photo.photoUrl.replace(/\\/g, '/')}`
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
  } */

  // Upload a profile picture to the server
    updateProfilePhoto(user: any, file: File): Observable<string> {
      const updateForm = new FormData();
      updateForm.append('Id', user.id.toString());
      updateForm.append('Name', user.name || '');
      updateForm.append('AboutMe', user.aboutMe || '');
      updateForm.append('AboutMeFormal', user.aboutMeFormal || '');
      updateForm.append('ProfilePicture', file);

      return this.http.put<any>(`${environment.apiBaseUrl}/user/${user.id}`, updateForm).pipe(
        map((user: any) => {
          return `${environment.serverBaseUrl}${user.profilePictureUrl?.replace(/\\/g, '/')}`;
        })
      );
    }
}
