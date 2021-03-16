import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-excel-table',
  templateUrl: './excel-table.component.html',
  styleUrls: ['./excel-table.component.scss']
})
export class ExcelTableComponent implements OnInit {
  @Input() pilgrims = []
  constructor() { }

  ngOnInit(): void {
  }

}
