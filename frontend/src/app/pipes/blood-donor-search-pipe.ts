import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'donorFilter'
})
export class FilterUserPipe implements PipeTransform {

  transform(list: any[], filterText: string): any {
    return list ? list.filter(item => {
      return (item.bloodGroup.search(new RegExp(filterText, 'i')) > -1) || (item.zipCode.search(new RegExp(filterText, 'i')) > -1)
    }) : [];
  }

 

}