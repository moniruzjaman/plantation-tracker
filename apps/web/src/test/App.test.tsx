import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders login page by default', () => {
    render(<App />);
    expect(screen.getByText('PMIS V2 Login')).toBeDefined();
  });

  it('has login form fields', () => {
    render(<App />);
    expect(screen.getByLabelText('Email')).toBeDefined();
    expect(screen.getByLabelText('Password')).toBeDefined();
    expect(screen.getByText('Login')).toBeDefined();
  });
});
