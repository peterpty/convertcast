import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

// Mock AuthContext for testing
const MockAuthContext = ({ children }: { children: React.ReactNode }) => {
  return <div data-testid="mock-auth-provider">{children}</div>;
};

// Custom render function that includes providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return <MockAuthContext>{children}</MockAuthContext>;
  };

  return render(ui, { wrapper: Wrapper, ...options });
};

// Export everything from testing-library
export * from '@testing-library/react';

// Override render method
export { customRender as render };

// Test data factories
export const createMockEvent = (overrides = {}) => ({
  id: '1',
  title: 'Test Event',
  description: 'Test Description',
  date: '2024-01-15',
  time: '2:00 PM',
  attendees: 100,
  status: 'scheduled' as const,
  revenue: '$1,000',
  type: 'webinar' as const,
  ...overrides,
});

export const createMockUser = (overrides = {}) => ({
  id: '1',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  company: 'Test Company',
  role: 'host' as const,
  ...overrides,
});

export const createMockNotification = (overrides = {}) => ({
  id: '1',
  type: 'info' as const,
  title: 'Test Notification',
  message: 'Test message',
  timestamp: new Date(),
  duration: 5000,
  ...overrides,
});

// Simple test to ensure this file is recognized as a test file
describe('Test Utils', () => {
  it('should export render function', () => {
    expect(render).toBeDefined();
  });

  it('should create mock event', () => {
    const event = createMockEvent();
    expect(event.id).toBe('1');
    expect(event.title).toBe('Test Event');
  });

  it('should create mock user', () => {
    const user = createMockUser();
    expect(user.email).toBe('test@example.com');
  });

  it('should create mock notification', () => {
    const notification = createMockNotification();
    expect(notification.type).toBe('info');
  });
});