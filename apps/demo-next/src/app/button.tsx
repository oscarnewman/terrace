'use client'

import { onSubmit } from '@/app/actions'
import { useOptimistic } from 'react'
import { useFormStatus } from 'react-dom'

export function Button({ onClick }) {
  return <button onClick={() => onClick()}>Click me</button>
}

export function Form() {
  const { pending } = useFormStatus()
  return (
    <form action={onSubmit} className="p-6">
      {pending && <div>Submitting...</div>}
      <div>
        name: <input type="text" name="name" className="border" />
      </div>
      <div>
        email: <input type="text" name="email" className="border" />
      </div>
      <button>Submit</button>
    </form>
  )
}
