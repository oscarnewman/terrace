'use server'

import { sql } from '@framework/database/connection'
import { revalidatePath } from 'next/cache'

export async function onSubmit(formData: FormData) {
  'use server'

  const name = formData.get('name')
  const email = formData.get('email')

  await sql`
    INSERT INTO users (name, email)
    VALUES (${name}, ${email});`

  revalidatePath('/', 'page')
}
