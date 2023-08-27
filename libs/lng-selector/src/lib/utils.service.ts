import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})

export class UtilsService {

  /**
   *
   * @param arr Pass an array of any type of objects, objects that share same interface only
   * @param prop pass the value whether it's a number or string to sort-by from the object
   * @param order pass ASC for Ascending, DESC for Descending order
   * @returns The same array in a sorted way using selection sort algorithm.
   *
   */
  sorter(arr: any[], prop: string, order : 'ASC'| 'DESC' = 'ASC'){

    for(let i = 0 ; i < arr.length; i++){
      for(let j = i+1 ; j < arr.length; j++){
        if(order === 'ASC'){

          if(arr[i][prop] > arr[j][prop]){
            const tempValue = arr[i];
            arr[i] = arr[j];
            arr[j] = tempValue;
          }
        }else{

          if(arr[i][prop] < arr[j][prop]){
            const tempValue = arr[j];
            arr[j] = arr[i];
            arr[i] = tempValue;
          }
        }
      }
    }

    return arr
  }

}
