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
  [x: string]: any;
  @ViewChild('addDetailsModal') addDetailsModal: any;
  @ViewChild('editModal') editModal: any;
  trainingselfieList: Trainingselfie[] = [];
  newSelfieDescription: string = '';
  selectedImage: File | null = null;
  editSelfieDescription: string = '';
  editSelectedImage: File | null = null;
  editImageUrl: string = ''; // To store the current image URL
  successMessage: string = '';
  editingSelfieId: number | null = null;

  constructor(private trainingselfieService: TrainingselfieService, private cdr: ChangeDetectorRef, private modalService: NgbModal) {}

  // Initialize the component and load training selfies
  ngOnInit(): void {
    this.loadTrainingSelfies(); // Load the training selfies when the component initializes
  }

  // Load the list of training selfies from the service
  loadTrainingSelfies(): void {
    this.trainingselfieService.TrainingselfieList().subscribe(
      (data: Trainingselfie[]) => {
        this.trainingselfieList = data; // Update the local list with fetched data
        this.cdr.detectChanges(); // Trigger change detection
      },
      (error) => {
        console.error('Error fetching training selfies:', error); // Log any errors
      }
    );
  }

  // Open the modal to add new training selfie details
  openAddDetailsModal() {
    this.modalService.open(this.addDetailsModal); // Open the add details modal
  }

  // Open the modal to edit an existing training selfie
  openEditModal(selfie: Trainingselfie) {
    this.editingSelfieId = selfie.id; // Store the ID of the selfie being edited
    this.editSelfieDescription = selfie.trainingDescription; // Set the current description
    this.editImageUrl = selfie.trainingImageUrl; // Set the current image URL
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
      formData.append('Id', this.editingSelfieId.toString()); // Use the stored ID
      formData.append('TrainingDescription', this.editSelfieDescription);
      if (this.editSelectedImage) {
        formData.append('TrainingImage', this.editSelectedImage); // Append the selected image if any
      }

      this.trainingselfieService.updateTrainingSelfie(this.editingSelfieId, formData).subscribe(
        () => {
          const index = this.trainingselfieList.findIndex(item => item.id === this.editingSelfieId);
          if (index !== -1) {
            this.trainingselfieList[index].trainingDescription = this.editSelfieDescription; // Update the description
            this.trainingselfieList[index].trainingImageUrl = this.editImageUrl; // Update the image URL
          }
          this.successMessage = 'Training selfie updated successfully!'; // Set success message
          this.cdr.detectChanges(); // Trigger change detection
          this.modalService.dismissAll(); // Close the modal
        },
        (error) => {
          console.error('Error editing training selfie:', error); // Log any errors
          alert('Failed to update training selfie. Please try again.'); // Alert the user on failure
        }
      );
    } else {
      console.error('Editing Selfie ID is null'); // Log if no ID is set for editing
    }
  }

  // Delete a training selfie
  deleteSelfie(id: number) {
    this.trainingselfieService.deleteTrainingSelfie(id).subscribe(
      () => {
        this.trainingselfieList = this.trainingselfieList.filter(item => item.id !== id); // Remove the deleted selfie from the list
        this.successMessage = 'Training selfie deleted successfully!'; // Set success message
        this.cdr.detectChanges(); // Trigger change detection
      },
      (error) => {
        console.error('Error deleting training selfie:', error); // Log any errors
      }
    );
  }
}
