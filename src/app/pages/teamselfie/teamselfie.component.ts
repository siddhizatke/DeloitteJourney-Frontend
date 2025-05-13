import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TeamselfieService } from '../../shared/teamselfie/teamselfie.service';
import { Teamselfie } from '../../shared/teamselfie/teamselfie.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-teamselfie',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teamselfie.component.html',
  styleUrl: './teamselfie.component.css'
})

export class TeamselfieComponent {
  @ViewChild('addDetailsModal') addDetailsModal: any;
  @ViewChild('editModal') editModal: any;
  teamselfieList: Teamselfie[] = [];
  newSelfieDescription: string = '';
  selectedImage: File | null = null;
  editSelfieDescription: string = '';
  editSelectedImage: File | null = null;
  editImageUrl: string = ''; // To store the current image URL
  successMessage: string = '';
  editingSelfieId: number | null = null;

  constructor(private teamselfieService: TeamselfieService, private cdr: ChangeDetectorRef, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.loadTeamSelfies(); // Load the team selfies when the component initializes
  }

  // Load the list of team selfies from the service
  loadTeamSelfies(): void {
    this.teamselfieService.TeamselfieList().subscribe(
      (data: Teamselfie[]) => {
        this.teamselfieList = data; // Update the local list with fetched data
        this.cdr.detectChanges(); // Trigger change detection
      },
      (error) => {
        console.error('Error fetching team selfies:', error); // Log any errors
      }
    );
  }

  // Open the modal to add new team selfie details
  openAddDetailsModal() {
    this.modalService.open(this.addDetailsModal); // Open the add details modal
  }

  // Open the modal to edit an existing team selfie
  openEditModal(team: Teamselfie) {
    this.editingSelfieId = team.id; // Store the ID of the selfie being edited
    this.editSelfieDescription = team.teamselfieDescription; // Set the current description
    this.editImageUrl = team.teamImageUrl; // Set the current image URL
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

  // Add a new team selfie
  addSelfie() {
    if (this.selectedImage) {
      this.teamselfieService.addTeamSelfie(this.newSelfieDescription, this.selectedImage).subscribe(
        (response: Teamselfie) => {
          this.successMessage = 'Team selfie added successfully!'; // Set success message
          this.teamselfieList.push(response); // Add the new selfie to the list
          this.cdr.detectChanges(); // Trigger change detection
          this.modalService.dismissAll(); // Close the modal
        },
        (error) => {
          console.error('Error adding team selfie:', error); // Log any errors
        }
      );
    }
  }

  // Edit an existing team selfie
  editSelfie() {
    if (this.editingSelfieId !== null) {
      const formData = new FormData();
      formData.append('Id', this.editingSelfieId.toString()); // Use the stored ID
      formData.append('TeamDescription', this.editSelfieDescription);
      if (this.editSelectedImage) {
        formData.append('TeamImage', this.editSelectedImage); // Append the selected image if any
      }

      this.teamselfieService.updateTeamSelfie(this.editingSelfieId, formData).subscribe(
        () => {
          const index = this.teamselfieList.findIndex(item => item.id === this.editingSelfieId);
          if (index !== -1) {
            this.teamselfieList[index].teamselfieDescription = this.editSelfieDescription; // Update the description
            this.teamselfieList[index].teamImageUrl = this.editImageUrl; // Update the image URL
          }
          this.successMessage = 'Team selfie updated successfully!'; // Set success message
          this.cdr.detectChanges(); // Trigger change detection
          this.modalService.dismissAll(); // Close the modal
        },
        (error) => {
          console.error('Error editing team selfie:', error); // Log any errors
          alert('Failed to update team selfie. Please try again.'); // Alert the user on failure
        }
      );
    } else {
      console.error('Editing Selfie ID is null'); // Log if no ID is set for editing
    }
  }

  // Delete a team selfie
  deleteSelfie(id: number) {
    this.teamselfieService.deleteTeamSelfie(id).subscribe(
      () => {
        this.teamselfieList = this.teamselfieList.filter(item => item.id !== id); // Remove the deleted selfie from the list
        this.successMessage = 'Team selfie deleted successfully!'; // Set success message
        this.cdr.detectChanges(); // Trigger change detection
      },
      (error) => {
        console.error('Error deleting team selfie:', error); // Log any errors
      }
    );
  }
}
