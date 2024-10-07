import { Injectable } from '@angular/core';
import { TapModel } from '../models/scorecard.model';
@Injectable({ providedIn: 'root' })
export class RaqamiService {
    private raqamiTaps:TapModel[] = [
        {
          id : 1,
          name : "A1",
          value : "A1"
        },
        {
          id : 2,
          name : "A2",
          value : "A2"
        },
        {
          id : 3,
          name : "A3",
          value : "A3"
        }
      ];
    getRaqamiTaps():TapModel[]
    {
        return this.raqamiTaps;
    }
}
