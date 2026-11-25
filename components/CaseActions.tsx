import { ArchiveRestore, FileBadge, ScanLine, Trash2 } from 'lucide-react';
import type { Command } from '../lib/case';
import type { InvestigationStep } from '../lib/investigation';

export function CaseActions({
  step,
  watching,
  busy,
  run,
  certificate
}: {
  step: InvestigationStep;
  watching: boolean;
  busy: boolean;
  run: (command: Command) => void;
  certificate: () => void;
}) {
  const icons = {
    'erase-primary': Trash2,
    scan: ScanLine,
    inspect: ScanLine,
    restore: ArchiveRestore,
    'erase-copy': Trash2
  };
  const Icon = step.command ? icons[step.command.type] : FileBadge;
  return (
    <section className="atlas-actions" aria-label="Investigation step">
      <div className="action-prompt">
        <span className="field-label">Step {step.number} of 4</span>
        <p>{watching ? 'The vault has opened. Watch where the record returns.' : step.watch}</p>
      </div>
      <div className="action-buttons">
        <button
          className="primary-button"
          aria-describedby="step-hint"
          aria-disabled={busy || watching}
          onClick={() => {
            if (!busy && !watching) {
              if (step.command) run(step.command);
              else certificate();
            }
          }}
        >
          <Icon size={16} />
          {busy ? 'Working…' : watching ? 'Witnessing the return…' : step.label}
        </button>
      </div>
    </section>
  );
}
