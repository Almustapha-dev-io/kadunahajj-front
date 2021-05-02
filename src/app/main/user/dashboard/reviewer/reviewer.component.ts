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

  allPilgrimsCounts = [];
  allPilgrimsZones = [];

  allPilgrimsByYearCounts = [];
  allPilgrimsByYearZones = [];

  allPilgrimsComplete = false;
  allPilgrimsByYearComplete = false;

  totalThisYear = 0;
  overAllTotal = 0;
  overAllTotalComplete = false;
  totalThisYearComplete = false;

  constructor(
    public loader: LoaderService,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.loader.showLoader();
    this.getCurrentYearCount();
    this.getAllPilgrimsCount();
    this.getAllPilgrimsForChart();
    this.getAllPilgrimsForChartThisYear();

    const interval = setInterval(() => {
      if (this.totalThisYearComplete && this.overAllTotalComplete && this.allPilgrimsComplete && this.allPilgrimsByYearComplete) {
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
    const uri = `${environment.analytics}/all-pilgrims-by-year/${yearId}`;

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

  getAllPilgrimsForChart(): void {
    const uri = `${environment.analytics}/all-lga-pilgrim-count`;

    this.subscription = this.dataService.get(uri, this.token).subscribe(response => {

      this.allPilgrimsCounts = [
        { data: response[0] }
      ];
      this.allPilgrimsZones = response[1];
      this.allPilgrimsComplete = true;
    });
  }

  getAllPilgrimsForChartThisYear(): void {
    const uri = `${environment.years}/by-year/${new Date().getFullYear()}`;

    this.subscription = this.dataService.get(uri, this.token).subscribe(year => {
      this.getAllPilgrimsForChartThisYearHelper(year._id);
    });
  }

  getAllPilgrimsForChartThisYearHelper(yearId): void {
    const uri = `${environment.analytics}/all-lga-pilgrim-count/${yearId}`;
    this.subscription = this.dataService.get(uri, this.token).subscribe(response => {

      this.allPilgrimsByYearCounts = [
        { data: response[0] }
      ];
      this.allPilgrimsByYearZones = response[1];
      this.allPilgrimsByYearComplete = true;
    });
  }
}

