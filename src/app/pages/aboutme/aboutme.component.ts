import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { PagesdetailsService } from '../../shared/aboutme/pagesdetails.service';
import { Pagesdetails, PagesdetailsPhotos } from '../../shared/aboutme/pagesdetails.model'; // Adjust the import path as necessary
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-aboutme', // Component selector used in HTML
  templateUrl: './aboutme.component.html', // Template file for the component
  standalone: true, // Indicates this component is standalone
  styleUrls: ['./aboutme.component.css'], // Stylesheet for the component
  imports: [CommonModule, FormsModule], // Modules imported for use in this component
})

export class AboutmeComponent implements OnInit {
  pagesDetailsList: Pagesdetails[] = []; // Holds the fetched data for pages details
  PagesdetailsPhotosList: PagesdetailsPhotos[] = []; // Holds the fetched data for photos
  selectedProfilePicture: File | null = null; // Stores the selected profile picture file
  selectedPhotos: File[] = []; // Stores the selected photos files
  selectedFile: File | null = null; // Stores the selected file for upload
  selectedFilePreviewUrl: SafeUrl | null = null; // Stores the preview URL of the selected file
  selectedDetails: Pagesdetails = { // Object to store the selected details
    id: 0, // Replace with the actual structure of your Pagesdetails model
    name: '',
    aboutMe: '',
    aboutMeFormal: '',
    profilePictureUrl: ''
  };
  successMessage: string = ''; // Message to display upon successful update
  PagesdetailsService: any; // Placeholder for the service, if needed

  constructor(
    public service: PagesdetailsService, // Injects the PagesdetailsService
    private modalService: NgbModal, // Injects the NgbModal service for modal operations
    private sanitizer: DomSanitizer // Injects the DomSanitizer for URL sanitization
  ) {}

  ngOnInit(): void {
    this.service.refreshList(); // Refreshes the list of page details
    this.service.refreshPhotoList(); // Refreshes the list of photos

    // Subscribe to the photos list observable
    this.service.photosList$.subscribe(data => {
      this.PagesdetailsPhotosList = data; // Updates the photos list in the component
      console.log('PagesdetailsPhotosList in Component:', this.PagesdetailsPhotosList); // Debugging log
    });
  }

  // Fallback for broken images
  onImageError(event: Event, fallbackUrl: string): void {
    (event.target as HTMLImageElement).src = fallbackUrl; // Sets a fallback URL for broken images
  }

  // Open the edit modal
  openEditModal(details: Pagesdetails, modal: any): void {
    console.log('Opening modal with details:', details); // Debugging log
    this.selectedDetails = { ...details }; // Copies details to selectedDetails
    this.modalService.open(modal, { size: 'lg', backdrop: 'static' }); // Opens the modal
  }

  // Handle profile picture selection
  onProfilePictureSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0]; // Stores the selected file
      this.selectedFilePreviewUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.selectedFile)); // Generates a preview URL
    }
  }

  // Handle photos selection
  onPhotosSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedPhotos = Array.from(input.files); // Stores the selected photos
      console.log('Selected Photos:', this.selectedPhotos); // Debugging log
      //this.selectedDetails.photosUrl = this.selectedPhotos.map((file) => file.name); // Uncomment if needed
    }
  }

  // Sanitize URLs
  sanitizeUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url); // Sanitizes a URL
  }

  // Update details
  updateDetails(): void {
    if (!this.selectedDetails.id || !this.selectedDetails.name) {
      alert('ID and Name are required.'); // Alerts if ID and Name are missing
      return;
    }

    const formData = new FormData(); // Creates a FormData object for the update
    formData.append('id', this.selectedDetails.id.toString());
    formData.append('name', this.selectedDetails.name);
    formData.append('aboutMe', this.selectedDetails.aboutMe || '');
    formData.append('aboutMeFormal', this.selectedDetails.aboutMeFormal || '');
    if (this.selectedFile) {
      formData.append('profilePicture', this.selectedFile); // Appends the profile picture if selected
    }

    this.service.updateUser(formData).subscribe(
      (response: any) => {
        this.service.refreshList(); // Refreshes the list after update
        this.successMessage = 'Data updated successfully!'; // Sets success message
        this.modalService.dismissAll(); // Closes the modal
        setTimeout(() => {
          this.successMessage = ''; // Clears the success message after 3 seconds
        }, 3000);
      },
      (error) => {
        console.error('Error updating data:', error); // Logs error
        alert('Failed to update data. Please check the input and try again.'); // Alerts on failure
      }
    );
  }

  // Method to sanitize mailto links
  sanitizeMailto(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url); // Sanitizes a mailto URL
  }
}
