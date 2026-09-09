import { Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LocalstorageService } from '@shared/services/localstorage/localstorage.service';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss'],
  standalone: true,
  imports: [RouterModule],
})
export class OptionsComponent {
  private localStorageService = inject(LocalstorageService);

  isPersonalMode = computed(() => {
    return this.localStorageService.activeTravelName() === 'Personal';
  });
}
