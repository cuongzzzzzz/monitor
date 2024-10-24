const express = require('express');
const client = require('prom-client');

const app = express();
const port = process.env.PORT || 3000;

// Thiết lập metrics cho Prometheus
const register = new client.Registry();
const httpRequestDurationMicroseconds = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.5, 1, 1.5]
});
register.registerMetric(httpRequestDurationMicroseconds);

app.get('/', (req, res) => {
    const end = httpRequestDurationMicroseconds.startTimer();
    res.send('Hello from Node.js with Docker, Prometheus, and Grafana!');
    end({ route: '/', method: 'GET', status_code: 200 });
});

app.get('/metrics', async (req, res) => {
    res.setHeader('Content-Type', register.contentType);
    res.end(await register.metrics());
});

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});
