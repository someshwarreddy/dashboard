import { Component, output } from '@angular/core';

@Component({
  selector: 'app-unsaved-changes-dialog',
  imports: [],
  templateUrl: './unsaved-changes-dialog.html',
  styleUrl: './unsaved-changes-dialog.scss',
})
export class UnsavedChangesDialog {
  stay = output<void>();
  leave = output<void>();
}
