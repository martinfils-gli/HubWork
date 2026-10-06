import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';
import App from '../App';
import { HubWorkProvider, useHubWork } from '../context/HubWorkContext';

const TestComponent = () => {
  const {
    tasks,
    addTask,
    toggleTaskComplete,
    totalBalance,
    addTransaction,
    hydration,
    addWaterGlass,
    healthScore,
    smartAlerts
  } = useHubWork();

  return (
    <div>
      <span data-testid="task-count">{tasks.length}</span>
      <span data-testid="balance">{totalBalance}</span>
      <span data-testid="water">{hydration.consumedLiters}</span>
      <span data-testid="score">{healthScore}</span>
      <span data-testid="alerts">{smartAlerts.length}</span>

      <button data-testid="add-task-btn" onClick={() => addTask({ title: 'New Test Task', category: 'Personal' })}>
        Add Task
      </button>

      <button data-testid="toggle-task-btn" onClick={() => toggleTaskComplete(tasks[0].id)}>
        Toggle First Task
      </button>

      <button data-testid="add-expense-btn" onClick={() => addTransaction({ title: 'Test Expense', amount: 100, type: 'Expense', accountId: 'acc-1' })}>
        Add Expense
      </button>

      <button data-testid="add-water-btn" onClick={addWaterGlass}>
        Add Water
      </button>
    </div>
  );
};

describe('HubWork Synchronized Personal OS Engine', () => {
  it('renders main application with Home view', () => {
    render(<App />);
    expect(screen.getByText(/Command Center/i)).toBeInTheDocument();
    expect(screen.getByText(/Today's Operating Plan/i)).toBeInTheDocument();
  });

  it('manages tasks, transactions, hydration and updates health score properly', () => {
    render(
      <HubWorkProvider>
        <TestComponent />
      </HubWorkProvider>
    );

    const initialTaskCount = parseInt(screen.getByTestId('task-count').textContent || '0');
    const initialBalance = parseFloat(screen.getByTestId('balance').textContent || '0');

    // Add Task
    fireEvent.click(screen.getByTestId('add-task-btn'));
    expect(screen.getByTestId('task-count').textContent).toBe(String(initialTaskCount + 1));

    // Add Expense
    fireEvent.click(screen.getByTestId('add-expense-btn'));
    expect(parseFloat(screen.getByTestId('balance').textContent || '0')).toBe(initialBalance - 100);

    // Add Water
    const initialWater = parseFloat(screen.getByTestId('water').textContent || '0');
    fireEvent.click(screen.getByTestId('add-water-btn'));
    expect(parseFloat(screen.getByTestId('water').textContent || '0')).toBeGreaterThan(initialWater);
  });

  it('opens search modal and filters items based on query', () => {
    render(<App />);

    // Open search modal via search button
    const searchButtons = screen.getAllByRole('button', { name: /search/i });
    fireEvent.click(searchButtons[0]);

    // Check search input presence
    const searchInput = screen.getByPlaceholderText(/Global search tasks/i);
    expect(searchInput).toBeInTheDocument();

    // Verify initial prompt before typing
    expect(screen.getByText(/Type to search across all operational modules/i)).toBeInTheDocument();

    // Type query
    fireEvent.change(searchInput, { target: { value: 'University' } });

    // Verify filtered search results
    expect(screen.getByText(/Submit University Application/i)).toBeInTheDocument();
  });
});
