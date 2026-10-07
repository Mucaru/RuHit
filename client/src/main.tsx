import '@fontsource-variable/dm-sans/wght.css'
import '@fontsource-variable/fraunces/wght.css'
import { createRoot } from 'react-dom/client'
import App from './App'
import { ErrorBoundary } from './components/ErrorBoundary'
import './index.css'
import './styles/progress.css'
import './styles/focus.css'

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
)
