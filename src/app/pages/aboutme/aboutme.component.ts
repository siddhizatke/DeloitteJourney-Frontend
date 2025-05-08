import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { PagesdetailsService } from '../../shared/aboutme/pagesdetails.service';
import { Pagesdetails } from '../../shared/aboutme/pagesdetails.model'; // Adjust the import path as necessary
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-aboutme',
  templateUrl: './aboutme.component.html',
  standalone: true,
  styleUrls: ['./aboutme.component.css'],
  imports: [CommonModule, FormsModule],
})
export class AboutmeComponent implements OnInit {
  selectedProfilePicture: File | null = null;
  selectedPhotos: File[] = [];
  selectedFile: File | null = null;
  selectedDetails: Pagesdetails = {
    id: 5, // Replace with the actual structure of your Pagesdetails model
    name: '',
    aboutMe: '',
    aboutMeFormal: '',
    profilePictureUrl: '',
    photosUrl: [],
  };
  successMessage: string = '';

  constructor(
    public service: PagesdetailsService,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.service.refreshList(); // Fetch the data when the component loads
  }

  // Fallback for broken images
  onImageError(event: Event, fallbackUrl: string): void {
    (event.target as HTMLImageElement).src = fallbackUrl;
  }

  // Open the edit modal
  openEditModal(details: Pagesdetails, modal: any): void {
    console.log('Opening modal with details:', details); // Debugging log
    this.selectedDetails = { ...details }; // Ensure the id field and other fields are included
    this.modalService.open(modal, { size: 'lg', backdrop: 'static' }); // Open the modal
  }

  // Handle profile picture selection
  onProfilePictureSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0]; // Store the selected profile picture
    }
  }

  // Handle photos selection
  onPhotosSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedPhotos = Array.from(input.files); // Store the selected photos
      console.log('Selected Photos:', this.selectedPhotos); // Debugging log
      this.selectedDetails.photosUrl = this.selectedPhotos.map((file) => file.name);
    }
  }

  // Add new photo URL
  addPhotoUrl(): void {
    this.selectedDetails.photosUrl.push(''); // Add an empty string to the array for a new photo URL
  }

  // Sanitize URLs
  sanitizeUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  // Update details
  updateDetails(): void {
    if (!this.selectedDetails.id || !this.selectedDetails.name) {
      alert('ID and Name are required.');
      return;
    }
  
    const formData = new FormData();
    formData.append('id', this.selectedDetails.id.toString());
    formData.append('name', this.selectedDetails.name);
    formData.append('aboutMe', this.selectedDetails.aboutMe || '');
    formData.append('aboutMeFormal', this.selectedDetails.aboutMeFormal || '');
    if (this.selectedFile) {
      formData.append('profilePicture', this.selectedFile);
    }
    this.selectedPhotos.forEach((photo) => {
      formData.append('photos', photo);
    });
  
    console.log('FormData:', Array.from(formData.entries())); // Debugging log
  
    this.service.updateUser(formData).subscribe(
      (response: any) => {
        if (response && response.photosUrl) {
          this.selectedDetails.photosUrl = response.photosUrl;
        }
        this.service.refreshList();
        this.successMessage = 'Data updated successfully!';
        this.modalService.dismissAll();
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      (error) => {
        console.error('Error updating data:', error);
        alert('Failed to update data. Please check the input and try again.');
      }
    );
  }
}  
