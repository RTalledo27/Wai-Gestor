import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Validador de fecha de inicio (debe ser hoy o futura)
export function fechaInicioValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const fechaInicio = new Date(control.value);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Ajuste la hora a 0 para comparar solo fechas

    return fechaInicio >= hoy ? null : { invalidFechaInicio: true };
  };
}

// Validador de fecha de fin (debe ser la misma o posterior a la fecha de inicio)
export function fechaFinValidator(fechaInicioControl: AbstractControl): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const fechaInicio = new Date(fechaInicioControl.value);
    const fechaFin = new Date(control.value);

    return fechaFin >= fechaInicio ? null : { invalidFechaFin: true };
  };
}

export function validDateValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const value = control.value;
    if (!value) {
      return null;
    }
    const isValidDate = !isNaN(Date.parse(value));
    return isValidDate ? null : {'invalidDate': {value}};
  };
}