import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
  DestroyRef
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
  ngOnInit(): void {
  this.route.paramMap
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(params => {
      const id = Number(params.get('id'));

      if (id > 0) {
        this.userState.loadUserById(id);
      }
    });
}
}
