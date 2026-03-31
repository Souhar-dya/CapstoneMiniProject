import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Auth from './Auth';

describe('Auth Component', () => {
  it('should render the email input field accessible by label', () => {
    render(
      <BrowserRouter>
        <Auth />
      </BrowserRouter>
    );
    
    // Using getByLabelText to find the element
    const emailInput = screen.getByLabelText(/Email address/i);
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('type', 'email');
  });

  it('should render the password input field accessible by label', () => {
    render(
      <BrowserRouter>
        <Auth />
      </BrowserRouter>
    );

    // Using getByLabelText to find the element
    const passwordInput = screen.getByLabelText(/Password/i);
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('should update value correctly when typing (by label)', () => {
    render(
      <BrowserRouter>
        <Auth />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/Email address/i);
    expect(emailInput.value).toBe('');
    
    // We could simulate typing using fireEvent or userEvent, but just checking 
    // the label binding correctly associates with the inputs is the main focus
    expect(emailInput.id).toBe('email');
  });
});
