import Fastify from 'fastify';

// Starter only: do NOT add a fake "PASS" endpoint or pretend a deletion run exists.
const app = Fastify({ logger: true, bodyLimit: 16 * 1024 });

app.get('/api/health', async () => ({
  ok: true as const,
  service: 'afterimage-api',
  productFeaturesImplemented: false as const,
}));

app.get('/api/scenarios', async (_request, reply) => {
  return reply.code(501).send({
    code: 'NOT_IMPLEMENTED',
    message: 'Scenario execution is a Kiro spec task; this is a development scaffold.',
  });
});

const host = process.env.API_HOST ?? '127.0.0.1';
const port = Number.parseInt(process.env.API_PORT ?? '8787', 10);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid API_PORT');
try {
  await app.listen({ host, port });
} catch (error) {
  app.log.error(error);
  process.exitCode = 1;
}
