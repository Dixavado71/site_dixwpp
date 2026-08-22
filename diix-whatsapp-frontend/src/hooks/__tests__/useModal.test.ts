import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useModal } from '../useModal'

describe('useModal', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should initialize with closed state', () => {
    const { result } = renderHook(() => useModal())
    
    expect(result.current.isOpen).toBe(false)
  })

  it('should open modal', () => {
    const { result } = renderHook(() => useModal())
    
    act(() => {
      result.current.open()
    })
    
    expect(result.current.isOpen).toBe(true)
  })

  it('should close modal', () => {
    const { result } = renderHook(() => useModal())
    
    act(() => {
      result.current.open()
      result.current.close()
    })
    
    expect(result.current.isOpen).toBe(false)
  })

  it('should toggle modal state', () => {
    const { result } = renderHook(() => useModal())
    
    act(() => {
      result.current.toggle()
    })
    
    expect(result.current.isOpen).toBe(true)
    
    act(() => {
      result.current.toggle()
    })
    
    expect(result.current.isOpen).toBe(false)
  })

  it('should call onOpen callback when opening', () => {
    const onOpenMock = vi.fn()
    const { result } = renderHook(() => useModal({ onOpen: onOpenMock }))
    
    act(() => {
      result.current.open()
    })
    
    expect(onOpenMock).toHaveBeenCalledTimes(1)
  })

  it('should call onClose callback when closing', () => {
    const onCloseMock = vi.fn()
    const { result } = renderHook(() => useModal({ 
      defaultOpen: true,
      onClose: onCloseMock 
    }))
    
    act(() => {
      result.current.close()
    })
    
    expect(onCloseMock).toHaveBeenCalledTimes(1)
  })
})
