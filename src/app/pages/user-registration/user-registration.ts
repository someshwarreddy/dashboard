import { Component, signal, inject } from '@angular/core';
import { form, FormField, FormRoot, required, schema, email, debounce, min, max, minLength, maxLength, validate, validateAsync } from '@angular/forms/signals';
import {
  createEmailAvailabilityResource
} from '../../shared/validators/email-availability.validator';
import { RoleSelector } from '../../components/role-selector/role-selector';
import { AuthService } from '../../services/auth';
interface UserFormModel {
  name: string;
  email: string;
  age: number;
  role: string;
}
// interface CheckEmailResponse {
//   exists: boolean;
// }


@Component({
  selector: 'app-user-registration',
  imports: [FormField, FormRoot, RoleSelector],
  templateUrl: './user-registration.html',
  styleUrl: './user-registration.scss'
})
export class UserRegistration {
  private authService = inject(AuthService);
  private createEmailResource =
    createEmailAvailabilityResource(this.authService);
  userModel = signal<UserFormModel>({
    name: '',
    email: '',
    age: 18,
    role: 'User'
  });
  userSchema = schema<UserFormModel>((path) => {
    debounce(path.name, 'blur');
    debounce(path.email, 'blur');
    required(path.name);
    minLength(path.name, 3);
    maxLength(path.name, 30);
    validate(path.name, ({ value }) => {
      const name = value();

      if (!/^[a-zA-Z\s]+$/.test(name)) {
        return {
          kind: 'invalidName',
          message: 'Name can contain only letters and spaces'
        };
      }

      return null;
    });
    required(path.email);
    email(path.email);

    min(path.age, 18);
    max(path.age, 60);
    validate(path, ({ value }) => {
      const user = value();

      if (user.age < 21 && user.role !== 'Admin') {
        return {
          kind: 'roleAgeMismatch',
          message: 'Users below 21 must have the Admin role'
        };
      }

      return null;
    });
    validateAsync(path.email, {
      params: ({ value }) => value(),

      factory: this.createEmailResource,

      onSuccess: (response) =>
        response?.exists
          ? {
            kind: 'emailAlreadyRegistered',
            message: 'Email is already registered'
          }
          : null,

      onError: () => ({
        kind: 'emailCheckFailed',
        message: 'Unable to verify email'
      })
    });

  });
  userForm = form(this.userModel, this.userSchema, {
    submission: {
      action: async (field) => {
        console.log('Submitted data:', field().value());
      },
      onInvalid: (field) => {
        console.log('Form is invalid');
        console.log('Errors:', field().errorSummary());
      }
    }
  });
}