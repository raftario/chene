import Sqlite from "better-sqlite3"
import { body, logger, response, router, z } from "chene"
import { serve } from "chene/node"
import { type Generated, Kysely, type Selectable, SqliteDialect } from "kysely"

interface TodoTable {
  id: Generated<number>
  text: string
  done: Generated<0 | 1>
}
interface Database {
  todo: TodoTable
}

type Todo = Selectable<TodoTable>

const url = process.env["DB"] ?? ":memory:"
const dialect = new SqliteDialect({ database: new Sqlite(url) })
const db = new Kysely<Database>({ dialect })

await db.schema
  .createTable("todo")
  .ifNotExists()
  .addColumn("id", "integer", (id) => id.primaryKey().autoIncrement())
  .addColumn("text", "text", (text) => text.notNull())
  .addColumn("done", "integer", (done) => done.notNull().defaultTo(0))
  .execute()

interface TodoListProps {
  todos: Todo[]
}
function TodoList({ todos }: TodoListProps) {
  const items = todos.map((t) => {
    const htmlId = `todo-${t.id}`
    return (
      <tr>
        <td>
          <input
            id={htmlId}
            type="checkbox"
            name="done"
            value={t.id}
            checked={t.done === 1}
          />
        </td>
        <td>
          <label for={htmlId}>{t.text}</label>
        </td>
      </tr>
    )
  })

  const save =
    items.length > 0 ? (
      <button type="submit" name="action" value="save">
        Save
      </button>
    ) : (
      "No TODOs"
    )

  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <title>TODO</title>
      </head>
      <body>
        <h1>TODO</h1>
        <form method="POST">
          <table>
            {items}
            <tr>
              <td colspan={2}>{save}</td>
            </tr>
            <tr>
              <td>
                <button type="submit" name="action" value="add">
                  Add
                </button>
              </td>
              <td>
                <input type="text" name="text" />
              </td>
            </tr>
          </table>
        </form>
      </body>
    </html>
  )
}

const app = router(logger({ latency: true }))
app.get("/", async () => {
  const todos = await db.selectFrom("todo").selectAll("todo").execute()
  return response.html(<TodoList todos={todos} />)
})

const form = z.union([
  z.object({
    action: z.literal("add"),
    text: z.string().min(1),
  }),
  z.object({
    action: z.literal("save"),
    done: z.array(z.number().int()),
  }),
])

app.post(
  "/",
  (ctx) => ctx.use(body.form(form)),

  async ({ body }) => {
    if (body.action === "add") {
      await db.insertInto("todo").values({ text: body.text }).execute()
    } else {
      const done = db
        .updateTable("todo")
        .where("id", "in", body.done)
        .set({ done: 1 })
        .execute()
      const todo = db
        .updateTable("todo")
        .where("id", "not in", body.done)
        .set({ done: 0 })
        .execute()
      await Promise.all([done, todo])
    }

    const todos = await db.selectFrom("todo").selectAll("todo").execute()
    return response.html(<TodoList todos={todos} />)
  },
)

serve(app, { port: 8080 })
