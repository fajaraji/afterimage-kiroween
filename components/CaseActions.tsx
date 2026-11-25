import { ArchiveRestore, FileBadge, ScanLine, Trash2 } from 'lucide-react';
import type { CaseFile, Command } from '../lib/case';
import { nextStep } from '../lib/investigation';

export function CaseActions({
  file,
  busy,
  run,
  certificate
}: {
  file: CaseFile;
  busy: boolean;
  run: (command: Command) => void;
  certificate: () => void;
}) {
  const step = nextStep(file);
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
      <div className="action-prompt" aria-live="polite" aria-atomic="true">
        <span className="field-label">Step {step.number} of 4</span>
        <p id="step-hint">{step.hint}</p>
      </div>
      <div className="action-buttons">
        <button
          className="primary-button"
          aria-describedby="step-hint"
          aria-disabled={busy}
          onClick={() => {
            if (!busy) {
              if (step.command) run(step.command);
              else certificate();
            }
          }}
        >
          <Icon size={16} />
          {busy ? 'Working…' : step.label}
        </button>
      </div>
    </section>
  );
}
