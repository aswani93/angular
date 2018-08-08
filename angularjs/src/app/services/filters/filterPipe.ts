import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "FilterPipe"
})
export class FilterPipe implements PipeTransform {

    transform(array: any[], query: string): any {
         if (query) {
            query = query.toLowerCase();
            return array.filter(function (el: any) {
                console.log(el.ap_name+"////"+el.ap_mac +"////"+query)
                return el.ap_name.toLowerCase().indexOf(query) > -1 || el.ap_mac.toLowerCase().indexOf(query) > -1 || el.ap_ip.toLowerCase().indexOf(query) > -1;
            })
        }
        return array; 
    }
}