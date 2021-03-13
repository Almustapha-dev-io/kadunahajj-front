import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'summary'
})
export class SummaryPipe implements PipeTransform {

  transform(value: string, limit?: number): string {

    if (!value) return null;

    const actualLimit = limit ? limit : 25;
    return value.length <= 15 ? value : value.substr(0, actualLimit) + '...';
  }

}
