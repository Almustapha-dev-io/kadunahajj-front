import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }

    searchText = searchText.toLocaleLowerCase();

    return items.filter(it => {

      return it.name?.toLocaleLowerCase().includes(searchText) || it.code?.toString().toLocaleLowerCase().includes(searchText)
        || it.year?.toString().toLocaleLowerCase().includes(searchText) || it.dateOpened?.toString().toLocaleLowerCase().includes(searchText)
        || it.lastClosed?.toString().toLocaleLowerCase().includes(searchText) || it.email?.toString().toLocaleLowerCase().includes(searchText)
        || it.name?.toString().toLocaleLowerCase().includes(searchText) || it.localGovernment?.name?.toString().toLocaleLowerCase().includes(searchText)
        || it.dateCreated?.toString().toLocaleLowerCase().includes(searchText) || it.code?.toString().toLocaleLowerCase().includes(searchText)
        || it.enrollmentDetails?.code?.toString().toLocaleLowerCase().includes(searchText) || it.personalDetails?.surname?.toString().toLocaleLowerCase().includes(searchText)
        || it.personalDetails?.otherNames?.toString().toLocaleLowerCase().includes(searchText) || it.personalDetails?.sex?.toString().toLocaleLowerCase().includes(searchText)
        || it.enrollmentDetails?.enrollmentZone?.name?.toString().toLocaleLowerCase().includes(searchText);
    });
  }

}
