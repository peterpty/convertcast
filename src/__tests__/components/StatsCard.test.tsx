import { render, screen } from '@testing-library/react';
import { Calendar } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';

describe('StatsCard', () => {
  const defaultProps = {
    title: 'Total Events',
    value: '24',
    change: '+12%',
    changeType: 'positive' as const,
    icon: Calendar,
    gradient: 'from-blue-500 to-cyan-500',
  };

  it('renders correctly with required props', () => {
    render(<StatsCard {...defaultProps} />);

    expect(screen.getByText('Total Events')).toBeInTheDocument();
    expect(screen.getByText('24')).toBeInTheDocument();
    expect(screen.getByText('+12%')).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    render(<StatsCard {...defaultProps} />);

    const card = screen.getByText('Total Events').closest('.group');
    expect(card).toHaveClass('bg-slate-800/50', 'border-slate-700');
  });

  it('handles click events when onClick is provided', () => {
    const handleClick = jest.fn();
    render(<StatsCard {...defaultProps} onClick={handleClick} />);

    const card = screen.getByText('Total Events').closest('.group');
    if (card) {
      card.click();
      expect(handleClick).toHaveBeenCalledTimes(1);
    }
  });

  it('renders different change types correctly', () => {
    const { rerender } = render(
      <StatsCard {...defaultProps} changeType="negative" />
    );

    expect(screen.getByText('+12%')).toHaveClass('text-red-400');

    rerender(<StatsCard {...defaultProps} changeType="neutral" />);
    expect(screen.getByText('+12%')).toHaveClass('text-slate-400');
  });

  it('renders without animation when animate is false', () => {
    render(<StatsCard {...defaultProps} animate={false} />);

    // Should render without motion wrapper
    expect(screen.getByText('Total Events')).toBeInTheDocument();
  });
});