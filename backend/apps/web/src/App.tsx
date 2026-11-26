import { useState } from 'react';

type Health = { ok: true; service: string; productFeaturesImplemented: false };

const planned = [
  { id: '01', name: 'Synthetic stores', description: 'Independent primary, analytics, and export adapters' },
  { id: '02', name: 'Resurrection replay', description: 'Deliberately unsafe and protected stale-event consumers' },
  { id: '03', name: 'Independent verifier', description: 'Direct observation: PRESENT, ABSENT, UNKNOWN' },
  { id: '04', name: 'Ghost Graph', description: 'Evidence-linked investigation and event timeline' },
  { id: '05', name: 'Autopsy Report', description: 'Reproducible proof of exactly what a test observed' },
];

export default function App() {
  const [health, setHealth] = useState<'unchecked' | 'online' | 'offline'>('unchecked');

  async function checkHealth() {
    try {
      const response = await fetch('/api/health');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data: Health = await response.json();
      setHealth(data.ok && data.productFeaturesImplemented === false ? 'online' : 'offline');
    } catch {
      setHealth('offline');
    }
  }

  return (
    <div className="page">
      <header className="topbar" aria-label="Application header">
        <a href="#main" className="brand"><span className="brandmark" aria-hidden="true">◉</span> AFTERIMAGE</a>
        <span className="pill">KIROWEEN 2026 · DEVELOPMENT SCAFFOLD</span>
      </header>
      <main id="main" className="main">
        <div className="eyebrow">THE DATA RESURRECTION LAB</div>
        <h1>Deleted is not always <em>gone.</em></h1>
        <p className="lead">A developer tool for recreating data deletion failures, replaying stale events, and verifying what survives. The lab is under construction; this page is a starter, not a completed simulation.</p>
        <div className="statusPanel">
          <div>
            <div className="statusTitle">Development status</div>
            <p>API health: <strong aria-live="polite">{health === 'unchecked' ? 'Not checked' : health === 'online' ? 'API reachable' : 'API unavailable'}</strong></p>
            <p>Deletion and verification flows: <strong>Not implemented</strong></p>
          </div>
          <button type="button" onClick={checkHealth}>Check API health</button>
        </div>
        <section aria-labelledby="roadmapTitle" className="roadmap">
          <div className="sectionHeading"><h2 id="roadmapTitle">Implementation map</h2><span>Build with Kiro specs 01 → 05</span></div>
          <div className="cards">
            {planned.map((item) => (
              <article className="card" key={item.id}>
                <div className="number">SPEC {item.id}</div>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <span className="pending">◌ Not implemented</span>
              </article>
            ))}
          </div>
        </section>
        <footer>
          <strong>Evidence first, effects second.</strong> All scenarios must use synthetic subjects and independently verified outcomes. No universal deletion guarantees.
        </footer>
      </main>
    </div>
  );
}
