import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Input } from '../Input';

describe('Input Component', () => {
  it('renders correctly with label', () => {
    render(<Input label="Nome" placeholder="Digite seu nome" />);
    expect(screen.getByLabelText('Nome')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite seu nome')).toBeInTheDocument();
  });

  it('handles error state', () => {
    render(<Input label="Email" error="Email inválido" />);
    expect(screen.getByText('Email inválido')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toHaveClass('border-danger');
  });

  it('handles disabled state', () => {
    render(<Input label="Telefone" disabled />);
    expect(screen.getByLabelText('Telefone')).toBeDisabled();
  });

  it('calls onChange when typing', () => {
    const handleChange = vi.fn();
    render(<Input label="Username" onChange={handleChange} />);
    
    const input = screen.getByLabelText('Username');
    input.focus();
    input.type('test');
    
    expect(handleChange).toHaveBeenCalledTimes(4);
  });

  it('applies custom className', () => {
    render(<Input label="Search" className="custom-input" />);
    expect(screen.getByLabelText('Search')).toHaveClass('custom-input');
  });

  it('renders required indicator', () => {
    render(<Input label="Senha" required />);
    expect(screen.getByLabelText('Senha')).toHaveAttribute('required');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<Input label="Test" ref={ref as any} />);
    expect(ref).toHaveBeenCalled();
  });
});
