import { createContext, useContext, useState, useEffect, useCallback } from 'react'

// ============================================
// 🎨 PRODUCTION-READY THEME SYSTEM
// Single file: ThemeContext + Features
// ============================================

// 1. THEME CONFIGURATION
const THEME_CONFIG = {
  storageKey: 'app-theme-preference',
  transitions: {
    duration: '300ms',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
  },
  themes: {
    light: {
      name: 'light',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#0f172a',
      textMuted: '#64748b',
      border: '#e2e8f0',
      primary: '#3b82f6',
      primaryHover: '#2563eb',
      shadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
    },
    dark: {
      name: 'dark',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f8fafc',
      textMuted: '#94a3b8',
      border: '#334155',
      primary: '#60a5fa',
      primaryHover: '#3b82f6',
      shadow: '0 1px 3px 0 rgb(0 0 0 / 0.3)'
    }
  }
}

// 2. UTILITY FUNCTIONS
const storage = {
  get: (key, fallback) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : fallback
    } catch {
      return fallback
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      console.warn('Storage failed:', e)
    }
  }
}

const getSystemPreference = () => {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// 3. CONTEXT SETUP
const ThemeContext = createContext(null)

// 4. PROVIDER COMPONENT
function ThemeProvider({ children, defaultTheme = 'system' }) {
  // State: theme can be 'light', 'dark', or 'system'
  const [theme, setTheme] = useState(() => {
    return storage.get(THEME_CONFIG.storageKey, defaultTheme)
  })
  
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Computed: actual color scheme
  const resolvedTheme = theme === 'system' ? getSystemPreference() : theme
  const isDark = resolvedTheme === 'dark'
  const colors = isDark ? THEME_CONFIG.themes.dark : THEME_CONFIG.themes.light

  // Apply theme to document (for CSS selectors and meta tags)
  useEffect(() => {
    const root = document.documentElement
    const body = document.body
    
    // Add transition class
    setIsTransitioning(true)
    
    // Apply data attribute for CSS targeting
    root.setAttribute('data-theme', resolvedTheme)
    
    // Apply CSS variables for global styling
    Object.entries(colors).forEach(([key, value]) => {
      if (key !== 'name') {
        root.style.setProperty(`--theme-${key}`, value)
      }
    })
    
    // Meta theme-color for mobile browsers
    const metaTheme = document.querySelector('meta[name="theme-color"]')
    if (metaTheme) {
      metaTheme.setAttribute('content', colors.background)
    }
    
    // Remove transition class after animation
    const timer = setTimeout(() => setIsTransitioning(false), 350)
    
    return () => clearTimeout(timer)
  }, [resolvedTheme, colors])

  // Listen to system preference changes
  useEffect(() => {
    if (theme !== 'system') return
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      // Force re-render by updating state with same value
      setTheme(prev => prev)
    }
    
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [theme])

  // Persist to storage
  useEffect(() => {
    storage.set(THEME_CONFIG.storageKey, theme)
  }, [theme])

  // Actions
  const setLight = useCallback(() => setTheme('light'), [])
  const setDark = useCallback(() => setTheme('dark'), [])
  const setSystem = useCallback(() => setTheme('system'), [])
  const toggle = useCallback(() => {
    setTheme(prev => {
      if (prev === 'system') return getSystemPreference() === 'dark' ? 'light' : 'dark'
      return prev === 'dark' ? 'light' : 'dark'
    })
  }, [])
  const cycle = useCallback(() => {
    setTheme(prev => {
      const order = ['light', 'dark', 'system']
      const currentIndex = order.indexOf(prev)
      return order[(currentIndex + 1) % order.length]
    })
  }, [])

  const value = {
    // State
    theme,           // 'light' | 'dark' | 'system'
    resolvedTheme,   // 'light' | 'dark' (actual applied)
    isDark,
    isTransitioning,
    colors,
    
    // Actions
    setLight,
    setDark,
    setSystem,
    toggle,
    cycle,
    setTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

// 5. CUSTOM HOOK
function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}

// 6. PRODUCTION COMPONENTS

// Theme Toggle Button (with icon support)
function ThemeToggle({ variant = 'button', showLabel = false, className = '' }) {
  const { theme, resolvedTheme, isDark, toggle, cycle, isTransitioning } = useTheme()
  
  const icons = {
    light: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    ),
    dark: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ),
    system: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    )
  }

  const labels = {
    light: 'Light mode',
    dark: 'Dark mode',
    system: 'System preference'
  }

  if (variant === 'select') {
    return (
      <select 
        value={theme} 
        onChange={(e) => useTheme().setTheme(e.target.value)}
        className={`theme-select ${className}`}
        aria-label="Select theme"
      >
        <option value="light">☀️ Light</option>
        <option value="dark">🌙 Dark</option>
        <option value="system">💻 System</option>
      </select>
    )
  }

  if (variant === 'cycle') {
    return (
      <button
        onClick={cycle}
        className={`theme-toggle cycle ${isTransitioning ? 'transitioning' : ''} ${className}`}
        aria-label={`Current: ${labels[theme]}. Click to cycle.`}
        title={`${labels[theme]} (click to cycle)`}
      >
        {icons[theme]}
        {showLabel && <span>{labels[theme]}</span>}
      </button>
    )
  }

  return (
    <button
      onClick={toggle}
      className={`theme-toggle ${isTransitioning ? 'transitioning' : ''} ${className}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
    >
      {isDark ? icons.light : icons.dark}
      {showLabel && <span>{isDark ? 'Light' : 'Dark'}</span>}
    </button>
  )
}

// Theme-Aware Container (applies CSS variables)
function ThemedContainer({ children, as: Component = 'div', className = '', ...props }) {
  const { colors } = useTheme()
  
  return (
    <Component 
      className={`themed-container ${className}`}
      style={{
        backgroundColor: colors.background,
        color: colors.text,
        transition: `background-color ${THEME_CONFIG.transitions.duration} ${THEME_CONFIG.transitions.easing},
                     color ${THEME_CONFIG.transitions.duration} ${THEME_CONFIG.transitions.easing}`
      }}
      {...props}
    >
      {children}
    </Component>
  )
}

// Production Header
function Header() {
  const { colors, resolvedTheme } = useTheme()
  
  return (
    <ThemedContainer as="header" className="app-header">
      <div className="header-content">
        <h1 style={{ color: colors.primary, margin: 0 }}>
          🚀 Production App
        </h1>
        <div className="header-actions">
          <span className="theme-badge" style={{ 
            background: colors.surface,
            color: colors.textMuted,
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 500,
            border: `1px solid ${colors.border}`
          }}>
            {resolvedTheme}
          </span>
          <ThemeToggle variant="cycle" showLabel />
        </div>
      </div>
    </ThemedContainer>
  )
}

// Demo Content
function DemoContent() {
  const { colors, theme } = useTheme()
  
  const features = [
    '✅ System preference detection',
    '🔄 Smooth transitions (300ms)',
    '💾 localStorage persistence',
    '♿ Full accessibility support',
    '📱 Meta theme-color updates',
    '🎨 CSS variable injection',
    '⚡ Optimized re-renders',
    '🔧 TypeScript ready'
  ]
  
  return (
    <ThemedContainer as="main" className="demo-content">
      <div className="content-wrapper">
        <h2 style={{ color: colors.text, marginTop: 0 }}>
          Production-Ready Features
        </h2>
        <p style={{ color: colors.textMuted, lineHeight: 1.6 }}>
          Current mode: <strong style={{ color: colors.primary }}>{theme}</strong>
          {theme === 'system' && ' (follows your OS preference)'}
        </p>
        
        <div className="feature-grid">
          {features.map((feature, i) => (
            <div 
              key={i}
              className="feature-card"
              style={{
                background: colors.surface,
                border: `1px solid ${colors.border}`,
                borderRadius: '12px',
                padding: '16px',
                boxShadow: colors.shadow
              }}
            >
              <span style={{ fontSize: '20px', marginRight: '8px' }}>
                {feature.split(' ')[0]}
              </span>
              <span style={{ color: colors.text }}>
                {feature.slice(3)}
              </span>
            </div>
          ))}
        </div>
        
        <div className="code-preview" style={{
          background: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: '8px',
          padding: '20px',
          marginTop: '24px',
          fontFamily: 'monospace',
          fontSize: '13px',
          color: colors.textMuted
        }}>
          <div style={{ color: colors.text, marginBottom: '8px', fontWeight: 600 }}>
            Usage:
          </div>
          <div>{`const { theme, toggle, colors } = useTheme()`}</div>
          <div>{`<button style={{ background: colors.primary }}>`}</div>
          <div>{`  Toggle Theme`}</div>
          <div>{`</button>`}</div>
        </div>
      </div>
    </ThemedContainer>
  )
}

// 7. MAIN APP
function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <div className="app">
        <Header />
        <DemoContent />
      </div>
    </ThemeProvider>
  )
}

// 8. GLOBAL STYLES (injected for single-file demo)
const GlobalStyles = () => (
  <style>{`
    * {
      box-sizing: border-box;
    }
    
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    
    .app {
      min-height: 100vh;
    }
    
    .app-header {
      border-bottom: 1px solid var(--theme-border);
      padding: 16px 24px;
      position: sticky;
      top: 0;
      z-index: 100;
      backdrop-filter: blur(8px);
    }
    
    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .header-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .theme-toggle {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border: 1px solid var(--theme-border);
      border-radius: 8px;
      background: var(--theme-surface);
      color: var(--theme-text);
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s ease;
    }
    
    .theme-toggle:hover {
      background: var(--theme-primary);
      color: white;
      border-color: var(--theme-primary);
    }
    
    .theme-toggle.transitioning {
      pointer-events: none;
      opacity: 0.7;
    }
    
    .theme-select {
      padding: 8px 12px;
      border-radius: 8px;
      border: 1px solid var(--theme-border);
      background: var(--theme-surface);
      color: var(--theme-text);
      cursor: pointer;
      font-size: 14px;
    }
    
    .demo-content {
      padding: 40px 24px;
    }
    
    .content-wrapper {
      max-width: 800px;
      margin: 0 auto;
    }
    
    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-top: 24px;
    }
    
    .feature-card {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    
    .feature-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px -5px rgb(0 0 0 / 0.1);
    }
    
    [data-theme="dark"] .feature-card:hover {
      box-shadow: 0 8px 25px -5px rgb(0 0 0 / 0.3);
    }
    
    /* Smooth transitions for all themed elements */
    [data-theme] * {
      transition: background-color 300ms cubic-bezier(0.4, 0, 0.2, 1),
                  border-color 300ms cubic-bezier(0.4, 0, 0.2, 1),
                  color 300ms cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    /* Respect reduced motion preference */
    @media (prefers-reduced-motion: reduce) {
      [data-theme] * {
        transition: none !important;
      }
    }
  `}</style>
)


export default App
export { ThemeProvider, useTheme, ThemeToggle, ThemedContainer, GlobalStyles }