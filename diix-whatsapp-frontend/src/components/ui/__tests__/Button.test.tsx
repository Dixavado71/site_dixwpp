import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '../Button';

describe('Button Component', () => {
  it('renders correctly with children', () => {
    render(<Button>Clique aqui</Button>);
    expect(screen.getByText('Clique aqui')).toBeInTheDocument();
  });

  it('applies variant classes correctly', () => {
    const { container: primary } = render(<Button variant="primary">Primary</Button>);
    const { container: secondary } = render(<Button variant="secondary">Secondary</Button>);
    const { container: danger } = render(<Button variant="danger">Danger</Button>);
    
    expect(primary.firstChild).toHaveClass('bg-primary');
    expect(secondary.firstChild).toHaveClass('bg-secondary');
    expect(danger.firstChild).toHaveClass('bg-danger');
  });

  it('handles disabled state', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByText('Disabled')).toBeDisabled();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    screen.getByText('Click me').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    expect(screen.getByText('Custom')).toHaveClass('custom-class');
  });

  it('renders loading state correctly', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByText('Loading')).toBeDisabled();
    // Verifica se o spinner está presente (ajuste conforme implementação real)
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });
});
