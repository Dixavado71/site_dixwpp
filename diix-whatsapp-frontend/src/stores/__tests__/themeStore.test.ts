import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useThemeStore } from '../themeStore';

describe('themeStore', () => {
  beforeEach(() => {
    // Reset store antes de cada teste
    const { result } = renderHook(() => useThemeStore());
    result.current.setTheme('light');
  });

  it('initializes with light theme', () => {
    const { result } = renderHook(() => useThemeStore());
    expect(result.current.theme).toBe('light');
  });

  it('toggles theme from light to dark', () => {
    const { result } = renderHook(() => useThemeStore());
    
    act(() => {
      result.current.toggleTheme();
    });
    
    expect(result.current.theme).toBe('dark');
  });

  it('toggles theme from dark to light', () => {
    const { result } = renderHook(() => useThemeStore());
    
    // Primeiro muda para dark
    act(() => {
      result.current.setTheme('dark');
    });
    expect(result.current.theme).toBe('dark');
    
    // Depois toggle volta para light
    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.theme).toBe('light');
  });

  it('sets theme explicitly', () => {
    const { result } = renderHook(() => useThemeStore());
    
    act(() => {
      result.current.setTheme('dark');
    });
    
    expect(result.current.theme).toBe('dark');
  });

  it('isDark returns correct boolean', () => {
    const { result } = renderHook(() => useThemeStore());
    
    expect(result.current.isDark).toBe(false);
    
    act(() => {
      result.current.setTheme('dark');
    });
    
    expect(result.current.isDark).toBe(true);
  });
});
