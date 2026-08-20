import { forwardRef, ReactNode } from 'react';
import { useForm, UseFormReturn, FieldValues, Path } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export interface FormFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  className?: string;
}

export interface FormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void | Promise<void>;
  children: ReactNode;
  className?: string;
  submitButton?: ReactNode;
  isLoading?: boolean;
}

export function Form<T extends FieldValues>({
  form,
  onSubmit,
  children,
  className,
  submitButton,
  isLoading = false,
}: FormProps<T>) {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className={cn('space-y-4', className)}>
      {children}
      {submitButton !== null && (
        <div className="pt-4">
          {submitButton || (
            <Button type="submit" variant="primary" isLoading={isLoading} className="w-full">
              Salvar
            </Button>
          )}
        </div>
      )}
    </form>
  );
}

// Componente de campo reutilizável para inputs
interface FormInputProps<T extends FieldValues> extends FormFieldProps {
  form: UseFormReturn<T>;
  name: Path<T>;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function FormInput<T extends FieldValues>({
  form,
  name,
  label,
  type = 'text',
  placeholder,
  error,
  required,
  disabled = false,
  className,
}: FormInputProps<T>) {
  const { register, formState: { errors } } = form;
  const errorMessage = error || (errors[name]?.message as string);

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-text-secondary mb-2">
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}
      <Input
        {...register(name)}
        type={type}
        placeholder={placeholder}
        error={errorMessage}
        disabled={disabled}
      />
    </div>
  );
}

// Componente de campo reutilizável para selects
interface FormSelectProps<T extends FieldValues> extends FormFieldProps {
  form: UseFormReturn<T>;
  name: Path<T>;
  options: { value: string | number; label: string }[];
  placeholder?: string;
  disabled?: boolean;
}

export function FormSelect<T extends FieldValues>({
  form,
  name,
  label,
  options,
  placeholder = 'Selecione...',
  error,
  required,
  disabled = false,
  className,
}: FormSelectProps<T>) {
  const { register, formState: { errors } } = form;
  const errorMessage = error || (errors[name]?.message as string);

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-text-secondary mb-2">
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}
      <select
        {...register(name)}
        disabled={disabled}
        className={cn(
          'w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-text-primary',
          'focus:outline-none focus:ring-2 focus:ring-accent-primary/50',
          errorMessage && 'border-error focus:ring-error/50'
        )}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errorMessage && (
        <p className="mt-1 text-sm text-error">{errorMessage}</p>
      )}
    </div>
  );
}

// Componente de campo reutilizável para checkboxes
interface FormCheckboxProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  description?: string;
  disabled?: boolean;
}

export function FormCheckbox<T extends FieldValues>({
  form,
  name,
  label,
  description,
  disabled = false,
}: FormCheckboxProps<T>) {
  const { register } = form;

  return (
    <div className="flex items-start gap-3">
      <input
        type="checkbox"
        {...register(name)}
        disabled={disabled}
        className="mt-1 w-4 h-4 rounded border-white/10 bg-white/5 text-accent-primary focus:ring-accent-primary"
      />
      <div>
        <label className="text-text-secondary cursor-pointer select-none">
          {label}
        </label>
        {description && (
          <p className="text-sm text-text-muted mt-1">{description}</p>
        )}
      </div>
    </div>
  );
}

// Componente de campo reutilizável para radio buttons
interface FormRadioProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  options: { value: string; label: string }[];
  disabled?: boolean;
}

export function FormRadio<T extends FieldValues>({
  form,
  name,
  label,
  options,
  disabled = false,
}: FormRadioProps<T>) {
  const { register } = form;

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-text-secondary mb-2">
          {label}
        </label>
      )}
      <div className="flex gap-4">
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value={option.value}
              {...register(name)}
              disabled={disabled}
              className="w-4 h-4 text-accent-primary bg-white/5 border-white/10 focus:ring-accent-primary"
            />
            <span className="text-text-secondary">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
