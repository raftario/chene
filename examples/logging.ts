import { logger, response, router } from "chene"
import { serve } from "chene/node"

const app = router(logger({ latency: true }))
app.get("/hello/:name", ({ path }) => response.text(`Hello ${path.name} !`))

serve(app, { port: 8080 })
