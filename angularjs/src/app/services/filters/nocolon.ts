import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'noColon'
})
export class NoColonPipe implements PipeTransform {

  transform(val: string): string {
    if (val !== undefined && val !== null) {
      // here we just remove the commas from value
      return val.replace(/:/g, "");
    } else {
      return "";
    }
  }
}