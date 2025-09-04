import { render, screen } from '@testing-library/react';
import App from '../App';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter

test('renders Construction Cost Tracker link', () => {
  render(
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
  const linkElement = screen.getByText(/Construction Cost Tracker/i);
  expect(linkElement).toBeInTheDocument();
});