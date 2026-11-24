import { Component, model, output } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

@Component({
  selector: 'app-role-selector',
  imports: [],
  templateUrl: './role-selector.html',
  styleUrl: './role-selector.scss',
})
export class RoleSelector implements FormValueControl<string> {
  value = model<string>('user');
  touch = output<void>();

  roles = ['user', 'admin'];

  selectRole(role: string) {
    this.value.set(role);
  }
}
