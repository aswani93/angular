import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "orderBy",
  pure:false

})
export class OrderByPipe implements PipeTransform {

  transform(array: Array<string>, args: string): Array<string> {
    array.sort((a: any, b: any) => {
    if(a[args]!= null && b[args]!=null){
	    if ( a[args].toUpperCase() < b[args].toUpperCase() ){
	    	return -1;
	    }else if( a[args].toUpperCase() > b[args].toUpperCase() ){
	        return 1;
	    }else{
	    	return 0;	
      }
    }
    });
    return array;
  }
} 