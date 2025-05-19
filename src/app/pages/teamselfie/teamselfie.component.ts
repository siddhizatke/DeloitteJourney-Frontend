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
  editTeamSelfieDescription: string = '';
  editTeamSelectedImage: File | null = null;
  editTeamImageBase64: string = ''; // To store the current image URL
  successMessage: string = '';
  editingTeamSelfieId: number | null = null;
  imageLoaded: boolean = false; // Flag to track if the image is loaded
  loading: boolean = true;
  http: any;
  constructor(private teamselfieService: TeamselfieService, private cdr: ChangeDetectorRef, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.loadTeamSelfies(); // Load the team selfies when the component initializes
  }

  // Load the list of team selfies from the service
    loadTeamSelfies(): void {
       this.loading = true;
  this.teamselfieService.getTeamSelfies().subscribe(
    (data: Teamselfie[]) => {
      this.teamselfieList = data;
      this.loading = false;
    },
    () => {
      this.loading = false;
    }
  );
}

    
    onImageLoad(team: Teamselfie) {
      team.imageLoaded = true;
      this.cdr.detectChanges(); // Ensures the UI updates immediately
    }



  // Open the modal to add new team selfie details
  openAddDetailsModal() {
    this.modalService.open(this.addDetailsModal); // Open the add details modal
  }

  // Open the modal to edit an existing training selfie
    openEditModal(selfie: Teamselfie) {
    this.editingTeamSelfieId = selfie.id; // Store the ID of the selfie being edited
    this.editTeamSelfieDescription = selfie.teamselfieDescription;// Set the current description
    this.editTeamImageBase64 = ''; // Reset the edit image URL
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
      this.editTeamSelectedImage = file; // Store the selected image file for editing
      // Update the image URL for preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.editTeamImageBase64 = e.target.result; // Update the preview URL
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

  // Edit an existing training selfie
  editSelfie() {
  if (this.editingTeamSelfieId !== null) {
    const formData = new FormData();
    formData.append('Id', this.editingTeamSelfieId.toString());
    formData.append('TeamDescription', this.editTeamSelfieDescription);
    if (this.editTeamSelectedImage) {
      formData.append('TeamImage', this.editTeamSelectedImage);
    }

    this.teamselfieService.updateTeamSelfie(this.editingTeamSelfieId, formData).subscribe(
      () => {
        this.successMessage = 'Training selfie updated successfully!';
        this.loadTeamSelfies(); // Reload from backend to get new Base64
        this.cdr.detectChanges();
        this.modalService.dismissAll();
      },
      (error: any) => {
        console.error('Error editing training selfie:', error);
        alert('Failed to update training selfie. Please try again.');
      }
    );
  } else {
    console.error('Editing Selfie ID is null');
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
