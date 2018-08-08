import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'dataFilter'
})
export class DataFilterPipe implements PipeTransform {

  transform(array: any[], query: string): any {
    if (query) {
      return array.filter(row =>
        (row.ap_name && row.ap_name.indexOf(query) > -1 ||
          row.ap_mac && row.ap_mac.indexOf(query) > -1 ||
          row.ap_model && row.ap_model.indexOf(query) > -1 ||
          row.ap_ip && row.ap_ip.indexOf(query) > -1 ||
          row.ap_name && row.ap_name.indexOf(query.toLowerCase()) > -1 ||
          row.ap_mac && row.ap_mac.indexOf(query.toLowerCase()) > -1 ||
          row.ap_model && row.ap_model.indexOf(query.toLowerCase()) > -1 ||
          row.ap_ip && row.ap_ip.indexOf(query.toLowerCase()) > -1 ||
          row.ap_name && row.ap_name.indexOf(query.toUpperCase()) > -1 ||
          row.ap_mac && row.ap_mac.indexOf(query.toUpperCase()) > -1 ||
          row.ap_model && row.ap_model.indexOf(query.toUpperCase()) > -1 ||
          row.ap_ip && row.ap_ip.indexOf(query.toUpperCase()) > -1));
    }
    return array;
  }
}
