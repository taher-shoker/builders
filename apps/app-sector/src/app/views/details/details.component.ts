import { Component } from '@angular/core';

@Component({
  selector: 'stc-apps-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent {
  cards = [
    {
      title: 'Definition',
      description:
        'Measures the STC KSA Earning before Interest and Taxes (EBIT) as reported in stc consolidated financial statements. The FY target is based on the latest budget approved by the BOD',
      class: 'col-12',
    },
    {
      title: 'Objective',
      description: 'Transforming Costs to Maximize Value',
      class: 'col-md-4 col-sm-6',
    },
    {
      title: 'Custodian Title',
      description: 'STC Financial Performance Section Manager',
      class: 'col-md-4 col-sm-6',
    },
    {
      title: 'Validation Authority',
      description: 'Finanicial Repoting & Control',
      class: 'col-md-4 col-sm-6',
    },
    {
      title: 'Sub-Scorecard Title',
      description: 'AP32023',
      class: 'col-md-3 col-sm-6',
    },
    {
      title: 'Calculation Function',
      description: 'Linear 2X',
      class: 'col-md-3 col-sm-6',
    },
    {
      title: 'Scorecard Title',
      description: 'Applications Sector',
      class: 'col-md-4 col-sm-6',
    },
    { title: 'Weight', description: '5.0%', class: 'col-md-2 col-sm-6' },
    {
      title: 'Data Source',
      description: 'STC P&L Report',
      class: 'col-md-3 col-sm-6',
    },
    {
      title: 'KPI Direction',
      description: 'Increasing',
      class: 'col-md-3 col-sm-6',
    },
    {
      title: 'Custodian Email',
      description: 'Gnejmeddin@stc.com.5d',
      class: 'col-md-4 col-sm-6',
    },
    { title: 'Ceiling', description: '110.0%', class: 'col-md-2 col-sm-6' },
    {
      title: 'Reporting Frequency',
      description: 'Qurterly',
      class: 'col-md-3 col-sm-6',
    },
    {
      title: 'Reporting Period',
      description: 'Q3 2023',
      class: 'col-md-3 col-sm-6',
    },
    {
      title: 'VTD Calculation',
      description: 'Periodle & Sum For YTD',
      class: 'col-md-4 col-sm-6',
    },
    { title: 'Threshold', description: '85%', class: 'col-md-2 col-sm-6' },
    { title: 'Formula & Validation Notes',  description: {
      text: "Measures the STC KSA Earning before Interest and Taxes (EBIT) as reported in stc consolidated financial statements. The FY target is based on the latest budget approved by the BOD",
      list: [
        "A = B - C - D",
        "Where,",
        "A = STC KSA EBIT",
        "B = STC KSA Revenues",
        "C = STC KSA Cost of Goods Sold"
      ],
      notes: [
        "Finance team shall communicate the validated and approved figures for COM official reference.",
        "CPM shall not consider any target or actual received from sources other than the KPI custodian officially assigned by the finance team.",
        "KPI Target is subject to further revision based on the official input received from the finance team aligned with the approved budget."
      ]
    },
     class: 'col-12' },
  ];
}
