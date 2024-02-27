import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilitiesService {
  /**
   *
   * @param obj Pass the object to filter
   * @returns and object that contains key-value pairs of only the properties that had a value
   */
  public filterObject<T>(obj: T): any {
    const filteredObject: any = {};

    // Iterate over each property in the input object
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key) && obj[key] !== '') {
        // Check if the property has a non-empty value
        filteredObject[key] = obj[key];
      }
    }

    return filteredObject;
  }
}
