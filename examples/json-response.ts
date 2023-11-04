import { type Context, type Json, type Middleware, response, router } from "chene"
import { serve } from "chene/node"

function jsonResponse<I extends Context>(): Middleware<I, Response, I, Json> {
  return async (input, next) => {
    const json = await next(input)
    return response.json(json)
  }
}

const app = router().use(jsonResponse())
app.get("/hello/:name", ({ path }) => {
  return { hello: path.name }
})

serve(app, { port: 8080 })
