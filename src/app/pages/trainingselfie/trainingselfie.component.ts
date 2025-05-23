import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TrainingselfieService } from '../../shared/trainingselfie/trainingselfie.service';
import { Trainingselfie } from '../../shared/trainingselfie/trainingselfie.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-trainingselfie',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trainingselfie.component.html',
  styleUrls: ['./trainingselfie.component.css']
})

export class TrainingselfieComponent {

  @ViewChild('addDetailsModal') addDetailsModal: any;
  @ViewChild('editModal') editModal: any;
  trainingselfieList: Trainingselfie[] = [];
  newSelfieDescription: string = '';
  selectedImage: File | null = null;
  editSelfieDescription: string = '';
  editSelectedImage: File | null = null;
  editImageUrl: string = '';
  formErrorMessage: string = ''; 
  successMessage: string = '';
  editingSelfieId: number | null = null;
 loadingImages: boolean[] = [];
 loading: boolean = true; 
   userRole: string = '';
  constructor(private trainingselfieService: TrainingselfieService, private cdr: ChangeDetectorRef, private modalService: NgbModal) {}

  // Initialize the component and load training selfies
  ngOnInit(): void {
    this.loadTrainingSelfies(); // Load the training selfies when the component initializes
    const user = sessionStorage.getItem('user');
    if (user) {
      this.userRole = JSON.parse(user).role; // Ensure 'roles' matches the backend response field
    console.log('User role:', this.userRole);
    }
  }

  // Load the list of training selfies from the service
  loadTrainingSelfies(): void {
    this.loading = true;
    this.trainingselfieService.getTrainingSelfie().subscribe(
      (data: Trainingselfie[]) => {
        this.trainingselfieList = data;
        this.loadingImages = data.map(() => true);
        this.loading = false;
      },
      (error) => {
        this.formErrorMessage = error?.error?.message || 'Failed to load training selfies. Please try again.';
        this.loading = false;
        this.clearMessages();
      }
    );
  }

     private clearMessages() {
    setTimeout(() => {
      this.successMessage = '';
      this.formErrorMessage = '';
    }, 3000);
  }
     onImageLoad(i: number) {
          this.loadingImages[i] = false;
          this.cdr.detectChanges();
    }
  

  // Open the modal to add new training selfie details
  openAddDetailsModal() {
    this.modalService.open(this.addDetailsModal); // Open the add details modal
  }

  // Open the modal to edit an existing training selfie
  openEditModal(selfie: Trainingselfie) {
  this.editingSelfieId = selfie.id; // Store the ID of the selfie being edited
  this.editSelfieDescription = selfie.trainingDescription; // Set the current description
  this.editImageUrl = ''; // Reset the edit image URL
  this.modalService.open(this.editModal); // Open the edit modal
}

  // Handle the selection of a new image for adding
  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file; // Store the selected image file
    }
  }

  // Handle the selection of a new image for editing
  onEditImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.editSelectedImage = file; // Store the selected image file for editing
      // Update the image URL for preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.editImageUrl = e.target.result; // Update the preview URL
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  }

  // Edit an existing training selfie
  editSelfie() {
    if (this.editingSelfieId !== null) {
      const formData = new FormData();
      formData.append('Id', this.editingSelfieId.toString());
      formData.append('TrainingDescription', this.editSelfieDescription);
      if (this.editSelectedImage) {
        formData.append('TrainingImage', this.editSelectedImage);
      }

      this.trainingselfieService.updateTrainingSelfie(this.editingSelfieId, formData).subscribe(
        () => {
          this.successMessage = 'Training selfie updated successfully!';
          this.loadTrainingSelfies();
          this.cdr.detectChanges();
          this.modalService.dismissAll();
          this.clearMessages();
        },
        (error: any) => {
          this.formErrorMessage = error?.error?.message || 'Failed to update training selfie. Please try again.';
          this.clearMessages();
        }
      );
    } else {
      this.formErrorMessage = 'Editing Selfie ID is null';
      this.clearMessages();
    }
  }


  // Delete a training selfie
  deleteSelfie(id: number) {
    this.trainingselfieService.deleteTrainingSelfie(id).subscribe(
      () => {
        this.trainingselfieList = this.trainingselfieList.filter(item => item.id !== id);
        this.successMessage = 'Training selfie deleted successfully!';
        this.cdr.detectChanges();
        this.clearMessages();
      },
      (error: any) => {
        this.formErrorMessage = error?.error?.message || 'Failed to delete training selfie. Please try again.';
        this.clearMessages();
      }
    );
  }
}
