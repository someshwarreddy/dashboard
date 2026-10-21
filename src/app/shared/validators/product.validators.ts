import { Validators } from '@angular/forms';
import { noWhitespaceValidator } from './no-whitespace.validator';
export const ProductValidators = {
  titleRequired: Validators.required,
  titleMinLength: Validators.minLength(3),
  titleMaxLength: Validators.maxLength(50),
  priceRequired: Validators.required,
  priceMin: Validators.min(1),
  titleNoWhitespace: noWhitespaceValidator()
};