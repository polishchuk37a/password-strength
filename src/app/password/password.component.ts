import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { customPatternValidator } from "../shared/custom-pattern-validator.function";
import { PasswordStrength } from "../enums/password-strength";
import { PasswordForm } from "./password-form";

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PasswordComponent {
  private readonly formBuilder = inject(FormBuilder);
  passwordValidators = [
    Validators.minLength(8),
    customPatternValidator(/[a-zA-Z]/, { hasLetters: true }),
    customPatternValidator(/\d/, { hasNumber: true }),
    customPatternValidator(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, { hasSymbols: true })
  ];

  form = this.formBuilder.group<PasswordForm>({
    password: this.formBuilder.nonNullable.control('', Validators.compose(this.passwordValidators))
  });

  get password(): FormControl<string> {
    return this.form.get('password') as FormControl<string>;
  }

  get className(): PasswordStrength {
    const hasLettersError = this.password.hasError('hasLetters');
    const hasNumberError = this.password.hasError('hasNumber');
    const hasSymbolsError = this.password.hasError('hasSymbols');
    const hasLengthError = this.password.hasError('minlength');

    switch (true) {
      case (!this.password.value):
        return PasswordStrength.Default;
      case (this.password.valid && !hasLengthError):
        return PasswordStrength.Strong;
      case (this.password.value.length < 8):
        return PasswordStrength.Invalid;
      case (!hasLettersError && !hasNumberError || !hasSymbolsError && !hasLettersError || !hasSymbolsError && !hasNumberError):
        return PasswordStrength.Medium;
      default:
        return PasswordStrength.Easy;
    }
  }
}
