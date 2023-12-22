import { useLoaderData } from "@remix-run/react"
import { Query } from 'framework/orm'



export async function loader() {
  const query = new Query('users')
  const users = await query.get()
  console.log(users)
  return {users}
}

export default function Index() {
  const {users} = useLoaderData()
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
      {
        users.map(user => <div>{user.name} {user.email}</div>)
      }
      <ul>
        <li>
          <a target="_blank" href="https://remix.run/tutorials/blog" rel="noreferrer">
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/tutorials/jokes" rel="noreferrer">
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>
    </div>
  )
}
