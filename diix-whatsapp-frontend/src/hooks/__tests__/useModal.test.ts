import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useModal } from '../useModal';

describe('useModal Hook', () => {
  it('initializes with closed state', () => {
    const { result } = renderHook(() => useModal());
    
    expect(result.current.isOpen).toBe(false);
    expect(result.current.data).toBeNull();
  });

  it('opens modal with open()', () => {
    const { result } = renderHook(() => useModal());
    
    act(() => {
      result.current.open();
    });
    
    expect(result.current.isOpen).toBe(true);
  });

  it('opens modal with data', () => {
    const testData = { id: 1, name: 'Test' };
    const { result } = renderHook(() => useModal());
    
    act(() => {
      result.current.open(testData);
    });
    
    expect(result.current.isOpen).toBe(true);
    expect(result.current.data).toEqual(testData);
  });

  it('closes modal with close()', () => {
    const { result } = renderHook(() => useModal());
    
    act(() => {
      result.current.open({ id: 1 });
    });
    
    expect(result.current.isOpen).toBe(true);
    
    act(() => {
      result.current.close();
    });
    
    expect(result.current.isOpen).toBe(false);
    expect(result.current.data).toBeNull();
  });

  it('toggles modal state', () => {
    const { result } = renderHook(() => useModal());
    
    // Toggle de fechado para aberto
    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(true);
    
    // Toggle de aberto para fechado
    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('resets to initial state on reset()', () => {
    const { result } = renderHook(() => useModal());
    
    act(() => {
      result.current.open({ id: 1, name: 'Test' });
    });
    
    expect(result.current.isOpen).toBe(true);
    expect(result.current.data).toEqual({ id: 1, name: 'Test' });
    
    act(() => {
      result.current.reset();
    });
    
    expect(result.current.isOpen).toBe(false);
    expect(result.current.data).toBeNull();
  });
});
