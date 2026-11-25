import test from 'node:test';
import assert from 'node:assert/strict';
import { startDemo } from '../lib/case.ts';

test('connected mode uses the configured API, revision and cookie scope; failures stay visible', async () => {
  const previousFetch = globalThis.fetch;
  const previousOrigin = process.env.NEXT_PUBLIC_AFTERIMAGE_API_BASE;
  const file = startDemo('team-case','2026-11-25T00:00:00Z').file;
  const calls = [];
  const next = structuredClone(file);
  next.revision = 1;
  next.stores[1].finding = 'unreachable';
  const responses = [
    Response.json(file), Response.json(next), Response.json(next),
    new Response(null,{status:409}), Response.json({version:1}), Response.json(file)
  ];
  process.env.NEXT_PUBLIC_AFTERIMAGE_API_BASE = 'https://example.test/v1/';
  globalThis.fetch = async (url,options) => { calls.push({url,options}); return responses.shift(); };
  try {
    const {openCase, commandCase, demoMode} = await import('../lib/gateway.ts');
    assert.equal(demoMode,false);
    const opened = await openCase();
    const updated = await commandCase(opened,{type:'scan'});
    assert.equal(updated.stores[1].finding,'unreachable');
    await openCase();
    const envelope = JSON.parse(calls[1].options.body);
    assert.equal(calls[0].url,'https://example.test/v1/cases');
    assert.equal(calls[0].options.method,'POST');
    assert.equal(calls[1].url,'https://example.test/v1/cases/team-case/commands');
    assert.equal(calls[1].options.credentials,'include');
    assert.equal(envelope.expectedRevision,0);
    assert.ok(envelope.commandId);
    assert.deepEqual(envelope.command,{type:'scan'});
    assert.equal(calls[2].url,'https://example.test/v1/cases/team-case');
    assert.equal(calls[2].options.method,'GET');
    await assert.rejects(commandCase(updated,{type:'scan'}),/changed/);
    await assert.rejects(openCase(),/incomplete/);
    await openCase(true);
    assert.equal(calls.at(-1).options.method,'POST');
    assert.equal(calls.at(-1).url,'https://example.test/v1/cases');
  } finally {
    globalThis.fetch = previousFetch;
    if (previousOrigin === undefined) delete process.env.NEXT_PUBLIC_AFTERIMAGE_API_BASE;
    else process.env.NEXT_PUBLIC_AFTERIMAGE_API_BASE = previousOrigin;
  }
});
