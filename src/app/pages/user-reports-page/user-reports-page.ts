import { Component, inject, OnInit } from '@angular/core';
import { ReportState } from '../../services/report-state.service';
import {  TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-user-reports-page',
 imports: [ TitleCasePipe],
  templateUrl: './user-reports-page.html',
  styleUrl: './user-reports-page.scss',
})
export class UserReportsPage implements OnInit{
    readonly reportState = inject(ReportState);

  ngOnInit(): void {
    this.reportState.loadUserReports();
  }

getMaxRegistrationCount(
  registrations: { _id: string; count: number }[]
): number {
  return Math.max(...registrations.map(item => item.count), 1);
}
}
