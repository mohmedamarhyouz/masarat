import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import App from './App'
import { db } from './lib/db'
import { useMasaratStore } from './store/use-masarat-store'

describe('Masarat application shell', () => {
  afterEach(async () => {
    cleanup()
    await db.projects.clear()
    useMasaratStore.setState({ projects: [], activeProjectId: undefined, view: 'dashboard', isReady: false })
  })

  it('seeds and renders the local example project', async () => {
    render(<App />)
    expect(await screen.findByText('حوّل الاحتمالات إلى خطوات واضحة.')).toBeInTheDocument()
    expect(screen.getAllByText('خطة التنقل والدراسة').length).toBeGreaterThan(0)
  })

  it('opens the execution view for the active local project', async () => {
    render(<App />)
    await screen.findByText('حوّل الاحتمالات إلى خطوات واضحة.')
    fireEvent.click(screen.getByRole('button', { name: 'التنفيذ' }))
    await waitFor(() => expect(screen.getByText('قائمة التنفيذ')).toBeInTheDocument())
    expect(screen.getAllByText('تأكيد السعر والضمان وقطع الغيار').length).toBeGreaterThan(0)
  })

  it('opens the horizontal decision canvas', async () => {
    render(<App />)
    await screen.findByText('حوّل الاحتمالات إلى خطوات واضحة.')
    fireEvent.click(screen.getByRole('button', { name: 'الخريطة' }))
    await waitFor(() => expect(screen.getByText('خريطة القرار')).toBeInTheDocument())
    expect(screen.getByText('كيف سأتنقل هذا العام؟')).toBeInTheDocument()
  })
})
