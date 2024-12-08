import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'stc-apps-api-test',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './api-test.component.html',
  styleUrls: ['./api-test.component.scss'],
})
export class ApiTestComponent {
  private fb = inject(FormBuilder);
  apiTestForm: FormGroup = new FormGroup({});
  standards: string[] = ['Standard A', 'Standard B', 'Standard C'];
  isRunning: boolean[] = [];
  testResults: any[] = [];
  isLoading = false;

  constructor() {
    this.apiTestForm = this.fb.group({
      tests: this.fb.array([this.createTestGroup()]),
    });

    this.isRunning = [false];
    this.testResults = [
      {
        testId: this.generateTestId(),
        apiName: '',
        standardName: '',
        overallResult: 'Not started',
      },
    ];
  }

  get tests(): FormArray {
    return this.apiTestForm.get('tests') as FormArray;
  }

  createTestGroup(): FormGroup {
    return this.fb.group({
      apiLink: ['', Validators.required],
      standard: ['', Validators.required],
    });
  }

  // Add a new test row
  addTest(): void {
    this.tests.push(this.createTestGroup());
    this.isRunning.push(false);
    this.testResults.push({
      testId: this.generateTestId(),
      apiName: '',
      standardName: '',
      overallResult: 'Not started',
    });
  }

  // Remove a test row
  removeTest(index: number): void {
    this.tests.removeAt(index);
    this.isRunning.splice(index, 1);
    this.testResults.splice(index, 1);
  }

  isLastTestValid(): boolean {
    if (this.tests.length === 0) {
      return true;
    }

    const lastTest = this.tests.at(this.tests.length - 1);
    return lastTest ? lastTest.valid : false;
  }

  isTestRunning(index: number): boolean {
    return this.isRunning[index] === true;
  }

  runTests() {
    this.isLoading = true;
    this.isRunning.forEach((_, index) => {
      this.isRunning[index] = true;
      this.testResults[index] = {
        testId: this.generateTestId(),
        apiName: this.apiTestForm.controls[index]?.get('apiName'),
        standardName: this.apiTestForm.controls[index]?.get('standard'),
        overallResult: 'Still in progress',
      };
    });
  }

  getTestId(index: number): string {
    return this.testResults[index]?.testId || 'N/A';
  }

  generateTestId() {
    return Math.floor(Math.random() * 10000000);
  }

  cancelTest(index: number) {
    this.isRunning[index] = false;
    this.testResults[index].overallResult = 'Cancelled';
  }

  getOverallResult(index: number): string {
    return this.testResults[index]?.overallResult || 'Not started';
  }
}
