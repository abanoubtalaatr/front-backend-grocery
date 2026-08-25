import { taskFormSchema } from '@/lib/validation/taskFormSchema'
import { useCallback, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'grocery-fronend:test-tasks'

export type TaskItem = { id: string; title: string; description: string }

type FieldErrors = Partial<Record<'title' | 'description', string>>

function readTasksFromStorage(): TaskItem[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const data = JSON.parse(raw) as unknown
    if (!Array.isArray(data)) return []
    return data.filter(
      (row): row is TaskItem =>
        row !== null &&
        typeof row === 'object' &&
        typeof (row as TaskItem).id === 'string' &&
        typeof (row as TaskItem).title === 'string' &&
        typeof (row as TaskItem).description === 'string',
    )
  } catch {
    return []
  }
}

/**
 * Task list + Zod-validated form. Lives under `src/hooks` so any page can import it
 * without coupling to a specific route folder.
 */
export function useTaskListForm() {
  const [busy, setBusy] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [tasks, setTasks] = useState<TaskItem[]>(() => readTasksFromStorage())

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch {
      /* quota or private mode */
    }
  }, [tasks])

  const taskCount = useMemo(() => tasks.length, [tasks])

  const submitTask = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setBusy(true)
    const form = e.currentTarget
    const fd = new FormData(form)
    const parsed = taskFormSchema.safeParse({
      title: String(fd.get('title') ?? ''),
      description: String(fd.get('description') ?? ''),
    })

    if (!parsed.success) {
      const fe = parsed.error.flatten().fieldErrors
      setFieldErrors({
        title: fe.title?.[0],
        description: fe.description?.[0],
      })
      setBusy(false)
      return
    }

    setFieldErrors({})
    setTasks((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        title: parsed.data.title,
        description: parsed.data.description,
      },
    ])
    form.reset()
    setBusy(false)
  }, [])

  const removeTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return {
    busy,
    fieldErrors,
    tasks,
    taskCount,
    submitTask,
    removeTask,
  }
}
