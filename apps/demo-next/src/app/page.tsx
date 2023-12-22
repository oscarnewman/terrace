import { Form } from '@/app/button'
import { Query } from 'framework/orm/query-builder'

export default async function Home() {
  const data = await new Query('users').get()

  return (
    <main>
      <ul>
        <Form />
        {data.map(user => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </main>
  )
}
