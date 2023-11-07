At a high level `chêne` is built on the same concept of middleware chain as `express` with two big differences.

1. The `next` function takes an input and returns an output. The input and output are typed. Which means middleware can enrich or transform both the input and outputs of route handler in a fully typed fashion.
2. Middleware can be chained at the route level and not just the app level.

Given the heavy focus on proper types, `chêne` integrates with [`zod`](https://zod.dev) to ensure data coming in has the expected type. Proper validation should be the default, not something that needs to be manually added on top of user logic.

```ts
import { body, router, z } from "chene"

const signupData = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

const app = router()
app.post(
  "/signup",
  // the json body middleware is registered at the route level and uses a Zod schema for validation
  (ctx) => ctx.use(body.json(signupData)),
  // the json body middleware enriches the route handler input with the parsed and validated body
  async ({ body }) => {
    // ...
    return response.json({ success: true })
  },
)

serve(app, { port: 8080 })
```

Zod validation is also available for form data with `body.form` and form URL query parameters with `url.query`.

The router also internally uses middleware chains to enrich route handler input with route parameters.

```ts
app.get("/hello/:name", ({ path }) => response.text(`Hello ${path.name} !`))
```

The handler input also always includes a `request` key containing a [standard Request object](https://developer.mozilla.org/docs/Web/API/Request) and the output is expected to be a [standard Response object](https://developer.mozilla.org/docs/Web/API/Response).

And that's pretty much all you need to know to get started !
