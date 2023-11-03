import {
  ConsoleMetricExporter,
  PeriodicExportingMetricReader,
} from "@opentelemetry/sdk-metrics"
import { NodeSDK } from "@opentelemetry/sdk-node"
import { ConsoleSpanExporter } from "@opentelemetry/sdk-trace-base"
import { response, router } from "chene"
import { serve } from "chene/node"
import { otel } from "chene/otel"

const sdk = new NodeSDK({
  traceExporter: new ConsoleSpanExporter(),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new ConsoleMetricExporter(),
  }),
})
sdk.start()

const app = router(otel)
app.get("/hello/:name", ({ path }) => response.text(`Hello ${path.name} !`))

serve(app, { port: 8080 })
