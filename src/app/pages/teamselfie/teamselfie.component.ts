import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TeamselfieService } from '../../shared/teamselfie/teamselfie.service'; // Ensure the correct path
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
  teamselfieList: any[] = []; // Initialize the list
  newSelfieDescription: string = ''; // Initialize new selfie description
  selectedImage: File | null = null;
  successMessage: string = '';

  constructor(private teamselfieService: TeamselfieService, private cdr: ChangeDetectorRef, private modalService: NgbModal) {} // Inject the service

  ngOnInit(): void {
    this.teamselfieService.TeamselfieList().subscribe(
      (data: any[]) => {
        console.log('Data fetched from API:', data);
        this.teamselfieList = data; // Assign the list
        this.cdr.detectChanges(); // Trigger change detection
        console.log('Team Selfie List:', this.teamselfieList);
      },
      (error) => {
        console.error('Error fetching team selfies:', error);
      }
    );
  }

  openAddDetailsModal() {
    this.modalService.open(this.addDetailsModal);
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
    }
  }

  addSelfie() {
    if (this.selectedImage) {
      this.teamselfieService.addTeamSelfie(this.newSelfieDescription, this.selectedImage).subscribe(
        (response) => {
          this.successMessage = 'Team selfie added successfully!';
          this.teamselfieList.push(response); // Add the new selfie to the list
          this.cdr.detectChanges(); // Trigger change detection
          this.modalService.dismissAll(); // Close the modal
        },
        (error) => {
          console.error('Error adding team selfie:', error);
        }
      );
    }
  }
}
