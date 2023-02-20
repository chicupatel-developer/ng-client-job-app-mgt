import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbDate, NgbCalendar, NgbDateParserFormatter, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { DataService } from '../../../services/data.service';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataService } from '../../../services/local-data.service';
import { Location } from '@angular/common';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import WorkExperience from '../../../models/workExperience';
import Education from '../../../models/education';
import PersonalInfo from '../../../models/personalInfo';


@Component({
  selector: 'app-view-my-resume',
  templateUrl: './view-my-resume.component.html',
  styleUrls: ['./view-my-resume.component.css']
})
export class ViewMyResumeComponent implements OnInit {

  workExperience = [];
  education = [];
  personalInfo = new PersonalInfo();
  skills = [];

  previewResumeFlag = false;
  error = '';

  
  constructor(private location: Location,
    private fb: FormBuilder,
    public dataService: DataService,
    public localDataService: LocalDataService,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter) {
  }

  ngOnInit(): void {
  
  }

  getResumeData() {
    this.personalInfo = this.localDataService.getPersonalInfo();
    this.skills = this.localDataService.getSkills();
    this.workExperience = this.localDataService.getWorkExperience();
    this.education = this.localDataService.getEducation();

    console.log(this.personalInfo, this.skills, this.workExperience, this.education);
  }

  createAndDownloadResume() {
    
  }
  createAndEmailResume() {
    
  }
  previewResume() {   
    this.getResumeData();

    this.previewResumeFlag = true;
    /*
    if (this.localDataService.isErrorBeforePreview(this.personalInfo, this.skills, this.workExperience, this.education)) {
      this.previewResumeFlag = false;
      this.error = "Information is Incomplete!";
    }
    else {
      this.previewResumeFlag = true;
    }
    */
    
  }
}