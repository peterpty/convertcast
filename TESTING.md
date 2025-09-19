# Testing Guide

This project uses a comprehensive testing setup with Jest for unit/integration tests and Playwright for end-to-end testing.

## Testing Stack

- **Jest**: Unit and integration testing
- **React Testing Library**: Component testing utilities
- **Playwright**: End-to-end testing
- **Jest Environment**: jsdom for browser-like testing

## Running Tests

### Unit/Integration Tests (Jest)
```bash
# Run all Jest tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### End-to-End Tests (Playwright)
```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests with UI (interactive mode)
npm run test:e2e:ui

# Run E2E tests in headed mode (see browser)
npm run test:e2e:headed
```

## Test Structure

### Unit/Integration Tests
- **Location**: `src/__tests__/`
- **Pattern**: `**/*.test.{ts,tsx}`
- **Utils**: `src/__tests__/utils/test-utils.tsx`

### End-to-End Tests
- **Location**: `tests/e2e/`
- **Pattern**: `**/*.spec.ts`
- **Config**: `playwright.config.ts`

## Writing Tests

### Component Tests (Jest + RTL)
```typescript
import { render, screen } from '@/src/__tests__/utils/test-utils';
import { MyComponent } from '@/components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

### E2E Tests (Playwright)
```typescript
import { test, expect } from '@playwright/test';

test('user can navigate to dashboard', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Dashboard');
  await expect(page).toHaveURL('/dashboard');
});
```

## Test Utilities

### Mock Factories
- `createMockEvent()`: Creates mock event objects
- `createMockUser()`: Creates mock user objects
- `createMockNotification()`: Creates mock notification objects

### Custom Render
The custom render function includes necessary providers and mocks for testing components in isolation.

## Coverage Goals

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

## Best Practices

1. **Test Behavior, Not Implementation**: Focus on what the component does, not how it does it
2. **Use Testing Library Queries**: Prefer screen queries that mirror user interactions
3. **Mock External Dependencies**: Mock API calls, third-party libraries, and complex dependencies
4. **Test User Interactions**: Use `userEvent` for realistic user interactions
5. **Keep Tests Isolated**: Each test should be independent and not rely on others
6. **Descriptive Test Names**: Use clear, descriptive test names that explain the expected behavior

## Continuous Integration

Tests run automatically on:
- Every commit (unit tests)
- Pull requests (full test suite)
- Before deployment (full test suite including E2E)

## Debugging Tests

### Jest Tests
```bash
# Debug specific test file
npm run test -- --testPathPattern=MyComponent.test.tsx

# Run tests with verbose output
npm run test -- --verbose
```

### Playwright Tests
```bash
# Run with debug mode
npx playwright test --debug

# Show trace viewer for failed tests
npx playwright show-trace trace.zip
```