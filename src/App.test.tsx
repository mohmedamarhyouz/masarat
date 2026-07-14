import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import App from './App'
import { db } from './lib/db'
import { useMasaratStore } from './store/use-masarat-store'

describe('Masarat application shell', () => {
  afterEach(async () => {
    cleanup()
    await db.projects.clear()
    useMasaratStore.setState({ projects: [], activeProjectId: undefined, view: 'today', isReady: false })
  })

  it('seeds the example project and builds the Today focus list', async () => {
    render(<App />)
    expect(await screen.findByText('ركّز على ما يحرّك حياتك اليوم.')).toBeInTheDocument()
    expect(screen.getByText('تركيز اليوم')).toBeInTheDocument()
    expect(useMasaratStore.getState().projects).toHaveLength(1)
  })

  it('resumes the active project in the execution view', async () => {
    render(<App />)
    await screen.findByText('ركّز على ما يحرّك حياتك اليوم.')
    fireEvent.click(screen.getByRole('button', { name: /متابعة من حيث توقفت/ }))
    await waitFor(() => expect(screen.getByText('قائمة التنفيذ')).toBeInTheDocument())
    expect(screen.getByText('المهام المكتملة')).toBeInTheDocument()
  })

  it('moves from Today to the horizontal decision canvas through path navigation', async () => {
    render(<App />)
    await screen.findByText('ركّز على ما يحرّك حياتك اليوم.')
    fireEvent.click(screen.getByRole('button', { name: /متابعة من حيث توقفت/ }))
    await waitFor(() => expect(screen.getByText('قائمة التنفيذ')).toBeInTheDocument())
    fireEvent.click(screen.getByRole('button', { name: 'الخريطة' }))
    await waitFor(() => expect(screen.getByText('خريطة القرار')).toBeInTheDocument())
    expect(screen.getByRole('button', { name: 'مساري فقط' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'كل الفروع' })).toBeInTheDocument()
  })

  it('opens the My Life overview from the primary navigation', async () => {
    render(<App />)
    await screen.findByText('ركّز على ما يحرّك حياتك اليوم.')
    fireEvent.click(screen.getByRole('button', { name: 'حياتي' }))
    await waitFor(() => expect(screen.getByText('حياتك ليست قائمة عشوائية.')).toBeInTheDocument())
    expect(screen.getByText('التنقل')).toBeInTheDocument()
  })

  it('completes a focus task from Today and persists the progress', async () => {
    render(<App />)
    await screen.findByText('ركّز على ما يحرّك حياتك اليوم.')
    const project = useMasaratStore.getState().projects[0]
    const task = project.tasks.find((item) => item.status === 'in_progress') ?? project.tasks.find((item) => item.status === 'pending')
    expect(task).toBeDefined()
    fireEvent.click(screen.getByRole('button', { name: `إكمال ${task!.title}` }))

    await waitFor(async () => {
      const activeProjectId = useMasaratStore.getState().activeProjectId
      const stored = activeProjectId ? await db.projects.get(activeProjectId) : undefined
      expect(stored?.tasks.find((item) => item.id === task!.id)?.status).toBe('completed')
    })
  })
})
