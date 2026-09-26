import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, generateId, cn } from '../lib/utils';

describe('Utility Helpers', () => {
  it('formats currency correctly', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
    expect(formatCurrency(0)).toBe('$0.00');
    expect(formatCurrency(50)).toBe('$50.00');
  });

  it('formats dates properly', () => {
    const formatted = formatDate('2025-09-25');
    expect(formatted).toContain('Sep');
    expect(formatted).toContain('25');
    expect(formatted).toContain('2025');
  });

  it('generates unique non-empty IDs', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).toBeTruthy();
    expect(id2).toBeTruthy();
    expect(id1).not.toBe(id2);
  });

  it('combines class names with cn', () => {
    const res = cn('p-4', 'bg-blue-500', { 'text-white': true, 'hidden': false });
    expect(res).toBe('p-4 bg-blue-500 text-white');
  });
});
