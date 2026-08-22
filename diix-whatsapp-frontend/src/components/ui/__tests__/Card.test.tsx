import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from '../Card';

describe('Card Component', () => {
  it('renders correctly with children', () => {
    render(<Card>Conteúdo do Card</Card>);
    expect(screen.getByText('Conteúdo do Card')).toBeInTheDocument();
  });

  it('renders with title', () => {
    render(<Card title="Título do Card">Conteúdo</Card>);
    expect(screen.getByText('Título do Card')).toBeInTheDocument();
  });

  it('renders with footer', () => {
    render(<Card footer={<button>Ação</button>}>Conteúdo</Card>);
    expect(screen.getByText('Ação')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Card className="custom-card">Conteúdo</Card>);
    expect(screen.getByText('Conteúdo')).toHaveClass('custom-card');
  });

  it('handles loading state', () => {
    render(<Card loading>Conteúdo</Card>);
    // Deve mostrar skeleton ou indicador de loading
    expect(screen.getByText('Conteúdo')).toBeInTheDocument();
  });

  it('renders header actions', () => {
    render(
      <Card 
        title="Card" 
        headerAction={<button>Ação</button>}
      >
        Conteúdo
      </Card>
    );
    expect(screen.getByText('Ação')).toBeInTheDocument();
  });
});
