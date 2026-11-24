import { Component, signal, inject } from '@angular/core';
import { form, FormField, FormRoot, required, schema, email, debounce, min, max, minLength, maxLength, validate, validateAsync } from '@angular/forms/signals';
import {
  createEmailAvailabilityResource
} from '../../shared/validators/email-availability.validator';
import { RoleSelector } from '../../components/role-selector/role-selector';
import { AuthService } from '../../services/auth';
import { User } from '../../services/user';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
interface UserFormModel {
  name: string;
  email: string;
  age: number;
  role: 'admin' | 'user';
  phone: string;
  gender: string;
  username: string;
  company: {
    name: string;
    title: string;
  };
}

@Component({
  selector: 'app-user-registration',
  imports: [FormField, FormRoot, RoleSelector],
  templateUrl: './user-registration.html',
  styleUrl: './user-registration.scss'
})
export class UserRegistration {
  private readonly userService = inject(User);
  readonly isSubmitting = signal(false);
  readonly successMessage = signal('');
  readonly errorMessage = signal('');
  private readonly createEmailResource =
    createEmailAvailabilityResource(inject(AuthService));
  readonly userModel = signal<UserFormModel>({
    name: '',
    email: '',
    age: 18,
    role: 'user',
    phone: '',
    gender: '',
    username: '',
    company: {
      name: '',
      title: ''
    }
  });
  readonly userSchema = schema<UserFormModel>((path) => {
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

      if (user.age < 21 && user.role !== 'admin') {
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
    // Phone
    required(path.phone);
    validate(path.phone, ({ value }) => {
      return /^\d{10}$/.test(value())
        ? null
        : {
          kind: 'invalidPhone',
          message: 'Enter a valid 10-digit phone number'
        };
    });

    // Username
    required(path.username);
    minLength(path.username, 3);
    maxLength(path.username, 20);
    // Gender
    required(path.gender);

    // Company name
    required(path.company.name);
    minLength(path.company.name, 2);
    maxLength(path.company.name, 50);

    // Company title
    required(path.company.title);
    minLength(path.company.title, 2);
    maxLength(path.company.title, 50);
  });
  readonly userForm = form(this.userModel, this.userSchema, {
    submission: {
      action: async (field) => {
        this.isSubmitting.set(true);
        this.successMessage.set('');
        this.errorMessage.set('');

        try {
          const user = field().value();

          const response = await firstValueFrom(
            this.userService.createUser(user)
          );

          this.successMessage.set(response.message);

          console.log('Created user:', response.user);

          field().reset({
            name: '',
            email: '',
            age: 18,
            role: 'user',
            phone: '',
            gender: '',
            username: '',
            company: {
              name: '',
              title: ''
            }
          });

        } catch (error: unknown) {
          if (error instanceof HttpErrorResponse) {
            this.errorMessage.set(
              error.error?.message ?? 'Failed to create user'
            );
          } else {
            this.errorMessage.set('An unexpected error occurred');
          }
        } finally {
          this.isSubmitting.set(false);
        }
      },

      onInvalid: () => {
        console.log('Please correct the form validation errors');
      }
    }
  });
}