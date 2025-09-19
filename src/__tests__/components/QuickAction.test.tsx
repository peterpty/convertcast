import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Plus } from 'lucide-react';
import { QuickAction } from '@/components/dashboard/QuickAction';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

describe('QuickAction', () => {
  const defaultProps = {
    title: 'Create New Event',
    description: 'Start a new webinar or meeting',
    href: '/dashboard/events/new',
    icon: Plus,
    iconColor: 'text-purple-400',
  };

  it('renders correctly with required props', () => {
    render(<QuickAction {...defaultProps} />);

    expect(screen.getByText('Create New Event')).toBeInTheDocument();
    expect(screen.getByText('Start a new webinar or meeting')).toBeInTheDocument();

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/dashboard/events/new');
  });

  it('renders without description', () => {
    const { description, ...propsWithoutDescription } = defaultProps;
    render(<QuickAction {...propsWithoutDescription} />);

    expect(screen.getByText('Create New Event')).toBeInTheDocument();
    expect(screen.queryByText('Start a new webinar or meeting')).not.toBeInTheDocument();
  });

  it('renders with badge', () => {
    render(<QuickAction {...defaultProps} badge="New" />);

    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('handles disabled state', () => {
    render(<QuickAction {...defaultProps} disabled />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('handles external links', () => {
    render(
      <QuickAction
        {...defaultProps}
        href="https://external.com"
        external
      />
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://external.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('calls onClick handler when provided', async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(<QuickAction {...defaultProps} onClick={handleClick} />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders without animation when animate is false', () => {
    render(<QuickAction {...defaultProps} animate={false} />);

    expect(screen.getByText('Create New Event')).toBeInTheDocument();
  });
});