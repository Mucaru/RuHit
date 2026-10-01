import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

type Props = { children: ReactNode }
type State = { hasError: boolean }

/** Menangkap error render supaya layar tidak putih kosong; pesan ramah anak, detail teknis hanya di console. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Ruang Hitung error:', error, info.componentStack)
  }

  render() {
    if (!this.state.hasError) return this.props.children
    return (
      <main className="error-screen" role="alert">
        <div className="error-card">
          <span className="error-emoji" aria-hidden="true">🙈</span>
          <h1>Ups, ada yang tidak beres</h1>
          <p>Tidak apa-apa, itu bukan salahmu. Coba muat ulang halaman ini, lalu mulai lagi ya.</p>
          <button className="primary-button large" type="button" onClick={() => window.location.reload()}>Muat ulang</button>
        </div>
      </main>
    )
  }
}
