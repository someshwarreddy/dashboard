import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import {
  CanComponentDeactivate,
  unsavedChangesGuard,
} from './unsaved-changes-guard';

describe('unsavedChangesGuard', () => {
  const executeGuard: CanDeactivateFn<CanComponentDeactivate> = (...guardParameters) =>
    TestBed.runInInjectionContext(() => unsavedChangesGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
   it('1. should call component canDeactivate method', () => {
    const component = {
      canDeactivate: vi.fn().mockReturnValue(true)
    };

    const result = TestBed.runInInjectionContext(() =>
      unsavedChangesGuard(
        component as any,
        {} as any,
        {} as any,
        {} as any
      )
    );

    expect(component.canDeactivate).toHaveBeenCalled();
    expect(result).toBe(true);
  });
  it('2. should return false when component rejects navigation', () => {
  const component = {
    canDeactivate: vi.fn().mockReturnValue(false)
  };

  const result = TestBed.runInInjectionContext(() =>
    unsavedChangesGuard(
      component as any,
      {} as any,
      {} as any,
      {} as any
    )
  );

  expect(component.canDeactivate).toHaveBeenCalled();
  expect(result).toBe(false);
});
it('4. should preserve the Promise result when it resolves to true', async () => {
  const component = {
    canDeactivate: vi.fn().mockResolvedValue(true)
  };

  const result = TestBed.runInInjectionContext(() =>
    unsavedChangesGuard(
      component as any,
      {} as any,
      {} as any,
      {} as any
    )
  );

  await expect(result).resolves.toBe(true);
});
});
