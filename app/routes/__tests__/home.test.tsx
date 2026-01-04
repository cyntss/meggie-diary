import { fireEvent, render, screen, within } from '@testing-library/react';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Home from '../home';

const STORAGE_PREFIX = 'meggie-diary-done';

const getStorageKey = (dateKey: string, scheduleId: string) =>
  `${STORAGE_PREFIX}:${dateKey}:${scheduleId}`;

describe('Home schedule daily reset', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('clears completed items when Berlin day rolls over', () => {
    vi.setSystemTime(new Date('2024-01-01T08:00:00.000Z'));
    const previousDateKey = '2024-01-01';
    const breakfastKey = getStorageKey(previousDateKey, 'breakfast');
    localStorage.setItem(breakfastKey, 'true');

    render(<Home />);

    vi.setSystemTime(new Date('2024-01-02T00:30:00.000Z'));
    act(() => {
      vi.advanceTimersByTime(30_000);
    });

    expect(localStorage.getItem(breakfastKey)).toBeNull();
  });

  it('stores new completion status under the current Berlin date', () => {
    vi.setSystemTime(new Date('2024-01-01T08:00:00.000Z'));
    render(<Home />);

    vi.setSystemTime(new Date('2024-01-02T08:00:00.000Z'));

    const breakfastTitle = screen.getByText('Breakfast');
    const breakfastRow = breakfastTitle.closest('div');
    if (!breakfastRow || !breakfastRow.parentElement) {
      throw new Error('Breakfast row not found');
    }

    const button = within(breakfastRow.parentElement).getByRole('button', {
      name: /mark done/i,
    });

    act(() => {
      fireEvent.click(button);
    });

    expect(
      localStorage.getItem(getStorageKey('2024-01-01', 'breakfast'))
    ).toBeNull();
    expect(
      localStorage.getItem(getStorageKey('2024-01-02', 'breakfast'))
    ).toBe('true');
  });
});
