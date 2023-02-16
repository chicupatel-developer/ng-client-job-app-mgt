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


@Component({
  selector: 'app-create-experience',
  templateUrl: './create-experience.component.html',
  styleUrls: ['./create-experience.component.css']
})
export class CreateExperienceComponent implements OnInit {

  
  saved = false;

  cities = [];
  provinces = [];
  jobDetails = [];

  // form
  weForm: FormGroup;
  submitted = false;

  workExperience = new WorkExperience();

  constructor(private location: Location,
    private fb: FormBuilder,
    public dataService: DataService,
    public localDataService: LocalDataService,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter) {        
  }

  ngOnInit(): void {
    this.weForm = this.fb.group({
      city: ['', Validators.required],
      province: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      employerName: ['', Validators.required],
      jobDetail: ['', Validators.required],
    });
    
    this.getProvinces();
  }
  
  getProvinces() {
    this.provinces = this.localDataService.getProvinces();
  }
  
  changeProvince(e) {
    console.log(e.target.value);
    this.cities = [];
    this.weForm.controls['city'].setValue('');

    if (e.target.value == "") {
      return;
    }
    else {
      var cities_ = this.localDataService.getCities(e.target.value);
      this.cities = cities_;
    }
  }

  
  get f() {
    return this.weForm.controls;
  }
  hasError = (controlName: string) => {
    if (controlName === 'startDate' || controlName==='endDate') {
      return !this.processDate(this.weForm.controls[controlName].value);
    }

    if (this.weForm.controls[controlName].value === null || this.weForm.controls[controlName].value === '') {
      return true;
    }
    else
      return false;
  }

  processDate(date_) {   
    if (date_ === '')
      return false; // 'empty date';
    else if (date_ === null || date_ === undefined)
      return false; // 'null date';
    else {
      var date__ = new Date(date_.year + "/" + date_.month + "/" + date_.day);
      if (Object.prototype.toString.call(date__) === "[object Date]") {
        // it is a date
        if (isNaN(date__.getTime())) { 
          return false; // 'invalid date,,,';
        } else {
          return true; // date__;
        }
      } else {
        // not a date object
        return false;  // 'invalid date,,,';
      }
    }
  }

  prepareJobDeatils(jobDetail) {
    var jobDetails_ = jobDetail.split("\n");
    console.log(jobDetails_);

    this.jobDetails = [];
    jobDetails_.forEach((x, index) => {
      if (x.length > 0)
        this.jobDetails.push(x);
    });    
    console.log(this.jobDetails);
  }
  onSubmit(): void {
    
    this.submitted = true;


    if (!this.weForm.valid) {
      console.log('Invalid Form!');
      return;
    }
    else {
      console.log(this.weForm.value);

      this.prepareJobDeatils(this.weForm.controls['jobDetail'].value);


      var wo = {
        employerName: this.weForm.controls['employerName'].value,
        jobDetails: this.jobDetails,
        province: this.weForm.controls['province'].value,
        city: this.weForm.controls['city'].value,
        startDate: new Date(this.weForm.controls['startDate'].value.year + "/" + this.weForm.controls['startDate'].value.month + "/" + this.weForm.controls['startDate'].value.day),
        endDate: new Date(this.weForm.controls['endDate'].value.year + "/" + this.weForm.controls['endDate'].value.month + "/" + this.weForm.controls['endDate'].value.day),
      };


      // save to local-data-service
      var wos = [];
      wos = this.localDataService.getWorkExperience();
      wos = [...wos, wo];
      this.localDataService.setWorkExperience(wos);
      console.log(this.localDataService.getWorkExperience());

      this.saved = true;
    
      setTimeout(() => {
        this.reset();
      }, 3000);     
    }
  }

  reset() {
    this.weForm.reset();
    this.submitted = false;
    this.saved = false;
  }
}


// startdate <= enddate