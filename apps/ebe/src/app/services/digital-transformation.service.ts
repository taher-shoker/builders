import { Injectable } from '@angular/core';
import { DigitalTransformationTapModel } from '../models/digital-transformation';

@Injectable({
  providedIn: 'root',
})
export class DigitalTransformationService {
  private readonly digitalTransformationTaps: DigitalTransformationTapModel[] =
    [
      { id: 1, name: 'Executive Summary', value: 'executive summary' },
      { id: 2, name: 'QA Compliance', value: 'QA compliance' },
      { id: 3, name: 'QA Conformance', value: 'QA conformance' },
      {
        id: 4,
        name: 'Technical Debt Dashboard',
        value: 'technical debt dashboard',
      },
      { id: 5, name: 'Capabilities Handover', value: 'capabilities handover' },
      { id: 6, name: 'Disaster Recovery', value: 'disaster recovery' },
      {
        id: 7,
        name: 'Key Challenges/Support Needed',
        value: 'key Challenges/Support needed',
      },
    ];
  getDigitalTransformationTaps(): DigitalTransformationTapModel[] {
    return this.digitalTransformationTaps;
  }
}
