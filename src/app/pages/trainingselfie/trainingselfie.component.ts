import { ChangeDetectorRef, Component, ViewChild, OnInit } from '@angular/core';
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
export class TrainingselfieComponent implements OnInit {
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

  constructor(
    private trainingselfieService: TrainingselfieService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadTrainingSelfies();
    this.userRole = this.authService.getUserRole();
  }

  loadTrainingSelfies(): void {
    this.loading = true;
    this.trainingselfieService.getTrainingSelfie().subscribe({
      next: (data: Trainingselfie[]) => {
        this.trainingselfieList = data;
        this.loadingImages = data.map(() => true);
        this.loading = false;
      },
      error: (error) => {
        this.formErrorMessage = this.errorHandler.handleError(error);
        this.loading = false;
        this.clearMessages();
      }
    });
  }

  private clearMessages(): void {
    setTimeout(() => {
      this.successMessage = '';
      this.formErrorMessage = '';
    }, 3000);
  }

  onImageLoad(i: number): void {
    this.loadingImages[i] = false;
    this.cdr.detectChanges();
  }

  openAddDetailsModal(): void {
    this.modalService.open(this.addDetailsModal);
  }

  openEditModal(selfie: Trainingselfie): void {
    this.editingSelfieId = selfie.id;
    this.editSelfieDescription = selfie.trainingDescription;
    this.editImageUrl = '';
    this.modalService.open(this.editModal);
  }

  onImageSelected(event: any): void {
    this.selectedImage = this.imageHandler.handleImageSelection(event);
  }

  onEditImageSelected(event: any): void {
    this.editSelectedImage = this.imageHandler.handleImageSelection(event);
  }

  addSelfie(): void {
    if (!this.newSelfieDescription || !this.selectedImage) {
      this.formErrorMessage = 'Please provide both description and image.';
      this.clearMessages();
      return;
    }

    const formData = new FormData();
    formData.append('TrainingDescription', this.newSelfieDescription);
    formData.append('TrainingImage', this.selectedImage);

    this.trainingselfieService.addTrainingSelfie(formData).subscribe({
      next: () => {
        this.successMessage = 'Training selfie added successfully!';
        this.newSelfieDescription = '';
        this.selectedImage = null;
        this.loadTrainingSelfies();
        this.modalService.dismissAll();
        this.clearMessages();
      },
      error: (error) => {
        this.formErrorMessage = this.errorHandler.handleError(error);
        this.clearMessages();
      }
    });
  }

  editSelfie(): void {
    if (this.editingSelfieId !== null) {
      const formData = new FormData();
      formData.append('Id', this.editingSelfieId.toString());
      formData.append('TrainingDescription', this.editSelfieDescription);
      
      if (this.editSelectedImage) {
        formData.append('TrainingImage', this.editSelectedImage);
      }

      this.trainingselfieService.updateTrainingSelfie(this.editingSelfieId, formData).subscribe({
        next: () => {
          this.successMessage = 'Training selfie updated successfully!';
          this.loadTrainingSelfies();
          this.cdr.detectChanges();
          this.modalService.dismissAll();
          this.clearMessages();
        },
        error: (error) => {
          this.formErrorMessage = this.errorHandler.handleError(error);
          this.clearMessages();
        }
      });
    } else {
      this.formErrorMessage = 'Editing Selfie ID is null';
      this.clearMessages();
    }
  }

  deleteSelfie(id: number): void {
    this.trainingselfieService.deleteTrainingSelfie(id).subscribe({
      next: () => {
        this.trainingselfieList = this.trainingselfieList.filter(item => item.id !== id);
        this.successMessage = 'Training selfie deleted successfully!';
        this.cdr.detectChanges();
        this.clearMessages();
      },
      error: (error) => {
        this.formErrorMessage = this.errorHandler.handleError(error);
        this.clearMessages();
      }
    });
  }

  isUserViewer(): boolean {
    return this.authService.isViewer();
  }
}