import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { ConfirmleaveService } from '../services/confirmleave.service';

export const canDeactivateGuard: CanDeactivateFn<unknown> = (component: any, currentRoute, currentState, nextState) => {
  const confirmService = inject(ConfirmleaveService);
  
  if (component.hasUnsavedData()) {
    return confirmService.confirmLeave('You have unsaved changes. Do you really want to leave?');
  }

  return true;
};
