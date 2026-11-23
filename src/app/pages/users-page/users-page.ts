
import {
  Component,
  inject,
  ChangeDetectionStrategy,
  OnInit,
  signal,

} from '@angular/core';

import { Router, RouterLink } from '@angular/router';
import { Userstate } from '../../services/userstate';

;

@Component({
  selector: 'app-users-page',
   imports: [RouterLink],
  templateUrl: './users-page.html',
  styleUrl: './users-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersPage implements OnInit {
  readonly userState = inject(Userstate);
private readonly router = inject(Router);
imageFailed = signal(false);
  ngOnInit(): void {
    this.userState.loadUsers();
  }

viewUser(id: string): void {
  this.router.navigate(['/admin/users', id]);
}
getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join('');
}
onImageError(): void {
  this.imageFailed.set(true);
}
}
