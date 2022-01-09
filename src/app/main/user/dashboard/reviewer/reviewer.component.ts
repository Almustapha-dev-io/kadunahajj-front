import { environment } from '@environment';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-reviewer',
  templateUrl: './reviewer.component.html',
  styleUrls: ['./reviewer.component.scss']
})
export class ReviewerComponent implements OnInit, OnDestroy {

  chartOptions = {
    responsive: true
  };
  chartLegend = false;
  chartPlugins = [];

  token = sessionStorage.getItem('token');
  yearId;
  localGov = sessionStorage.getItem('localGov');
  subscription = new Subscription();

  allAllocationsCounts = [];
  allAllocationsZones = [];

  allAllocationsByYearCounts = [];
  allAllocationsByYearZones = [];

  allAllocationsComplete = false;
  allAllocationsByYearComplete = false;

  totalThisYear = 0;
  overAllTotal = 0;
  overAllTotalComplete = false;
  totalThisYearComplete = false;

  totalAllocations = 0;

  constructor(  
    public loader: LoaderService,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.loader.showLoader();
    this.getCurrentYearCount();
    this.getAllPilgrimsCount();
    this.getAllAllocationsForChart();
    this.getAllAllocationsForChartThisYear();
    this.getAllAllocationsCount();
    
    const interval = setInterval(() => {
      if (this.totalThisYearComplete && this.overAllTotalComplete && this.allAllocationsComplete && this.allAllocationsByYearComplete) {
        this.loader.hideLoader();

        clearInterval(interval);
      }
    }, 100);
  }

  ngOnDestroy(): void {
    this.loader.hideLoader();
    this.subscription.unsubscribe();
  }

  getCurrentYearCount(): void {
    const uri = `${environment.years}/by-year/${new Date().getFullYear()}`;

    this.subscription = this.dataService.get(uri, this.token).subscribe(year => {
      this.getCurrentYearCountHelper(year._id);
    });
  }

  getCurrentYearCountHelper(yearId): void {
    const uri = `${environment.analytics}/all-allocations-by-year/${yearId}`;

    this.subscription = this.dataService.get(uri, this.token).subscribe(response => {
      this.totalThisYear = response.count;
      this.totalThisYearComplete = true;
    });
  }

  getAllPilgrimsCount(): void {
    const uri = `${environment.analytics}/all-pilgrims`;
    this.subscription = this.dataService.get(uri, this.token).subscribe(response => {
      this.overAllTotal = response.count;
      this.overAllTotalComplete = true;
    });
  }
  
  getAllAllocationsCount(): void {
    const uri = `${environment.analytics}/all-allocations`;
    this.subscription = this.dataService.get(uri, this.token).subscribe(response => {
      this.totalAllocations = response.count;
    });
  }

  getAllAllocationsForChart(): void {
    const uri = `${environment.analytics}/all-lga-allocations-count`;

    this.subscription = this.dataService.get(uri, this.token).subscribe(response => {

      this.allAllocationsCounts = [
        { data: response[0] }
      ];
      this.allAllocationsZones = response[1];
      this.allAllocationsComplete = true;
    });
  }

  getAllAllocationsForChartThisYear(): void {
    const uri = `${environment.years}/by-year/${new Date().getFullYear()}`;

    this.subscription = this.dataService.get(uri, this.token).subscribe(year => {
      this.getAllAllocationsForChartThisYearHelper(year._id);
    });
  }

  getAllAllocationsForChartThisYearHelper(yearId): void {
    const uri = `${environment.analytics}/all-lga-allocations-count/${yearId}`;
    this.subscription = this.dataService.get(uri, this.token).subscribe(response => {

      this.allAllocationsByYearCounts = [
        { data: response[0] }
      ];
      this.allAllocationsByYearZones = response[1];
      this.allAllocationsByYearComplete = true;
    });
  }
}

