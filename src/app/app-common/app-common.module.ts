import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../elements/loader/loader.component';
import { SortDirective } from '../common/directives/sort.directive';
import { FilterPipe } from '../common/pipes/filter.pipe';
import { DragAndDropDirective } from '../common/directives/drag-and-drop.directive';



@NgModule({
  declarations: [
    LoaderComponent,
    SortDirective,
    FilterPipe,
    DragAndDropDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LoaderComponent,
    SortDirective,
    FilterPipe,
    DragAndDropDirective
  ]
})
export class AppCommonModule { }
