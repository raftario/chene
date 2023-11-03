import { response, router } from "chene"
import { serve } from "chene/node"

const app = router().get("/hello/:name", ({ path }) =>
  response.html(<h1>Hello {path.name} !</h1>),
)

serve(app, { port: 8080 })
