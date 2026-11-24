import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
  DestroyRef,
  signal
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Userstate } from '../../services/userstate';

@Component({
  selector: 'app-user-details-page',
  imports: [RouterLink],
  templateUrl: './user-details-page.html',
  styleUrl: './user-details-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDetailsPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  readonly userState = inject(Userstate);
  private readonly destroyRef = inject(DestroyRef);
  imageFailed = signal(false);
  ngOnInit(): void {
 this.route.paramMap
  .pipe(takeUntilDestroyed(this.destroyRef))
  .subscribe(params => {
    const id = params.get('id');

    if (id) {
      this.userState.loadUserById(id);
    }
  });
}
getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map(part => part.charAt(0).toUpperCase())
    .join('');
}
}
