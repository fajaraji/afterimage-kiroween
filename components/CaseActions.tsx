import { ArrowRight, ArchiveRestore, FileBadge, ScanLine, Trash2 } from 'lucide-react';
import { canRestore, evidence, outcome, STORES } from '../lib/case';
import type { CaseFile, Command, StoreId } from '../lib/case';

interface Step {
  label: string;
  hint: string;
  command?: Command;
}
function guidance(file: CaseFile): Step {
  if (!file.erasureRequested)
    return {
      label: 'Erase primary record',
      hint: 'Remove the active record. Its copies may survive.',
      command: { type: 'erase-primary' }
    };
  if (file.stores.some((s) => s.finding === 'unchecked'))
    return {
      label: 'Scan all locations',
      hint: 'Read each store to see what survived the deletion.',
      command: { type: 'scan' }
    };
  const pending = file.stores.find((s) => s.pendingCheck);
  if (pending)
    return {
      label: 'Recheck location',
      hint: 'Verify the removal at ' + STORES[pending.id].name.toLowerCase() + '.',
      command: { type: 'inspect', store: pending.id }
    };
  if (file.events.some((e) => e.kind === 'return'))
    return {
      label: 'View certificate',
      hint: 'The event log and certificate include the restored record.'
    };
  const copy = file.stores.find((s) => s.id !== 'backup' && outcome(s) === 'found');
  if (copy)
    return {
      label: 'Erase ' + STORES[copy.id].short.toLowerCase(),
      hint: 'This location still holds a copy. Erase it, then recheck.',
      command: { type: 'erase-copy', store: copy.id }
    };
  if (canRestore(file))
    return {
      label: 'Restore snapshot',
      hint: 'The primary is clear. Restore the retained backup to test it.',
      command: { type: 'restore' }
    };
  return { label: 'View certificate', hint: 'Review the recorded scope and the latest findings.' };
}
function choices(file: CaseFile, id: StoreId | null): Step[] {
  if (!id || !file.erasureRequested) return [guidance(file)];
  const item = evidence(file, id);
  const inspect: Step = {
    label: item.pendingCheck ? 'Recheck location' : 'Inspect location',
    hint: 'Read the current contents of ' + STORES[id].name.toLowerCase() + '.',
    command: { type: 'inspect', store: id }
  };
  if (outcome(item) !== 'found') return [inspect];
  const erase: Step = {
    label: 'Erase this copy',
    hint: 'Remove the copy at ' + STORES[id].name.toLowerCase() + ' and recheck the result.',
    command: { type: 'erase-copy', store: id }
  };
  if (id === 'backup' && canRestore(file))
    return [
      {
        label: 'Restore snapshot',
        hint: 'Follow the retained record from the vault to the primary database.',
        command: { type: 'restore' }
      },
      erase,
      inspect
    ];
  return [erase, inspect];
}
export function CaseActions({
  file,
  selected,
  busy,
  run,
  certificate
}: {
  file: CaseFile;
  selected: StoreId | null;
  busy: boolean;
  run: (c: Command) => void;
  certificate: () => void;
}) {
  const [main, ...other] = choices(file, selected);
  const icon = main.command?.type;
  const Icon =
    icon === 'restore'
      ? ArchiveRestore
      : icon === 'erase-copy' || icon === 'erase-primary'
        ? Trash2
        : icon
          ? ScanLine
          : FileBadge;
  return (
    <div className="atlas-actions">
      <div className="action-prompt">
        <span className="field-label">{selected ? STORES[selected].name : 'Next action'}</span>
        <p>{main.hint}</p>
      </div>
      <div className="action-buttons">
        <button
          className="primary-button"
          disabled={busy}
          onClick={() => (main.command ? run(main.command) : certificate())}
        >
          <Icon size={16} />
          {busy ? 'Working…' : main.label}
          {!main.command && <ArrowRight size={14} />}
        </button>
        {other.map((step) => (
          <button
            key={step.label}
            className="text-button"
            disabled={busy}
            onClick={() => run(step.command!)}
          >
            {step.label}
          </button>
        ))}
      </div>
    </div>
  );
}
