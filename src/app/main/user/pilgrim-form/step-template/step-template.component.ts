import { Component, Input, OnInit } from '@angular/core';

import { StepModel } from '../../../../common/models/step.model';

@Component({
  selector: 'app-step-template',
  templateUrl: './step-template.component.html',
  styleUrls: ['./step-template.component.scss']
})
export class StepTemplateComponent implements OnInit {
  @Input('step') step: StepModel;

  constructor() { }

  ngOnInit(): void {}
}
