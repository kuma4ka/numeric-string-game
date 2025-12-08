import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import GameControls from './GameControls';
import { ALGORITHMS } from '../utils/constants';

describe('GameControls Component', () => {
  const mockOnStart = vi.fn();
  const mockOnAlgorithmChange = vi.fn();

  it('renders correctly with initial setup', () => {
    render(
      <GameControls
        onStart={mockOnStart}
        gameStatus="IDLE"
        algorithm={ALGORITHMS.ALPHA_BETA}
        onAlgorithmChange={mockOnAlgorithmChange}
      />
    );

    expect(screen.getByText('Start')).toBeInTheDocument();

    const input = screen.getByRole('spinbutton');
    expect(input).toHaveValue(20);
  });

  it('calls onStart when button is clicked', () => {
    render(
      <GameControls
        onStart={mockOnStart}
        gameStatus="IDLE"
        algorithm={ALGORITHMS.ALPHA_BETA}
        onAlgorithmChange={mockOnAlgorithmChange}
      />
    );

    const button = screen.getByText('Start');

    fireEvent.click(button);

    expect(mockOnStart).toHaveBeenCalledWith(20);
  });

  it('disables input when game is PLAYING', () => {
    render(
      <GameControls
        onStart={mockOnStart}
        gameStatus="PLAYING"
        algorithm={ALGORITHMS.ALPHA_BETA}
        onAlgorithmChange={mockOnAlgorithmChange}
      />
    );

    const input = screen.getByRole('spinbutton');
    expect(input).toBeDisabled();
  });
});
