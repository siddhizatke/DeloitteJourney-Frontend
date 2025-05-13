import { Component, OnInit } from '@angular/core';
import { TrainingdetailsService } from '../../shared/trainingactivites/trainingdetails.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-trainingactivities',
  templateUrl: './trainingactivities.component.html',
  styleUrls: ['./trainingactivities.component.css'],
  imports: [CommonModule, FormsModule]
})

export class TrainingactivitiesComponent implements OnInit {
  showAddActivityForm = false;

  newActivity = {
    id: 0,
    topicOfTheDay: '',
    description: '',
    dateOfTraining: '',
    trainerName: ''
  };

  constructor(public service: TrainingdetailsService, private toastr: ToastrService) {}

  // Initialize the component and refresh the training activities list
  ngOnInit(): void {
    this.service.refreshTrainingActivitiesList(); // Refreshes the list of training activities
  }

  // Display a success message using Toastr
  showSuccessMessage(): void {
    this.toastr.success('Training activity loaded successfully!'); // Shows a success notification
  }
}
