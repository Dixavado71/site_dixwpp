import { useEffect, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface MainContentProps {
  children: ReactNode;
  className?: string;
  isSidebarOpen?: boolean;
}

export default function MainContent({ 
  children, 
  className,
  isSidebarOpen = true 
}: MainContentProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <main
      className={cn(
        "transition-all duration-300",
        // Desktop: margin based on sidebar state
        !isMobile && (isSidebarOpen ? 'ml-72' : 'ml-0'),
        // Mobile: no margin (sidebar is overlay)
        isMobile && 'ml-0',
        className
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-[--container-max-width]">
        {children}
      </div>
    </main>
  )
}
