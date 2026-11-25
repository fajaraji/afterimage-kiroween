import { useEffect, useRef } from 'react';
import { ArrowRight, BookOpen, Volume2, VolumeX } from 'lucide-react';
import type { CaseFile, StoreId } from '../lib/case';
import { caseSteps } from './CaseActions';
import { headstone, paper, phantom } from './atlas/draw';
import { landmark } from './atlas/landmarks';
import { etch, oval } from './atlas/print';

type Plate = 'erase' | 'inspect' | 'restore';
export type GuideMode = 'entry' | 'reference';
export type GuideChoice = 'sound' | 'silent' | 'back';
const seenKey = 'afterimage:field-guide:v1';

export function hasReadGuide() {
  try {
    return localStorage.getItem(seenKey) === 'yes';
  } catch {
    return false;
  }
}
export function markGuideRead() {
  try {
    localStorage.setItem(seenKey, 'yes');
  } catch {
    /* Closing the guide still works. */
  }
}

// These are prints of the same objects used on the live cemetery map.
function GuidePlate({ scene }: { scene: Plate }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const ctx = ref.current?.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(2, 0, 0, 2, 0, 0);
    ctx.clearRect(0, 0, 152, 80);
    ctx.save();
    if (scene === 'erase') {
      ctx.translate(55, 62);
      ctx.scale(0.56, 0.56);
      landmark(ctx, 'primary');
      ctx.restore();
      ctx.save();
      etch(ctx, 'M77 58Q88 54 96 60T117 61', '#ad7968', 1);
      oval(ctx, 115, 60, 14, 2.5, '#18121c');
      paper(ctx, 112, 47, 1.65, '#f8c995');
    } else if (scene === 'inspect') {
      ctx.translate(47, 64);
      headstone(ctx);
      ctx.translate(53, 0);
      phantom(ctx, false);
    } else {
      ctx.translate(43, 60);
      ctx.scale(0.8, 0.8);
      landmark(ctx, 'backup', 0.8);
      ctx.restore();
      ctx.save();
      ctx.setLineDash([3, 3]);
      etch(ctx, 'M66 58Q86 43 104 56', '#eaa478', 1.4);
      ctx.setLineDash([]);
      ctx.translate(114, 58);
      ctx.scale(0.81, 0.81);
      phantom(ctx, true);
    }
    ctx.restore();
  }, [scene]);
  return <canvas className="guide-plate" ref={ref} width={304} height={160} aria-hidden="true" />;
}

export function FieldGuide({
  file,
  selected,
  mode,
  finish
}: {
  file: CaseFile;
  selected: StoreId | null;
  mode: GuideMode;
  finish: (choice: GuideChoice) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const sheet = dialog.current!;
    sheet.showModal();
    title.current?.focus({ preventScroll: true });
    return () => sheet.close();
  }, []);
  const entry = mode === 'entry';
  function leave(choice: GuideChoice) {
    dialog.current?.close();
    finish(choice);
  }
  return (
    <dialog
      className="field-guide"
      ref={dialog}
      aria-labelledby="guide-title"
      aria-describedby="guide-brief"
      onCancel={(event) => {
        event.preventDefault();
        leave(entry ? 'silent' : 'back');
      }}
    >
      <div className="guide-paper">
        <div className="guide-imprint">
          <span>
            <BookOpen size={16} />
            Field guide
          </span>
          <span>Case {file.reference}</span>
        </div>
        <h2 id="guide-title" ref={title} tabIndex={-1}>
          Where did the record go?
        </h2>
        <p id="guide-brief">
          <strong>{file.subject.name}</strong> has asked for erasure. Follow one record through four storage
          locations to find out what survives.
        </p>
        <ol className="guide-steps" aria-label="How to investigate">
          <li>
            <GuidePlate scene="erase" />
            <div>
              <h3>Erase the original</h3>
              <p>
                Choose <strong>Erase primary record</strong>. Removing it from the database leaves other
                copies to investigate.
              </p>
            </div>
          </li>
          <li>
            <GuidePlate scene="inspect" />
            <div>
              <h3>Read the graves</h3>
              <p>
                <strong>Scan all locations</strong>. A ghost means a copy was found. A headstone means a
                read confirmed its absence.
              </p>
            </div>
          </li>
          <li>
            <GuidePlate scene="restore" />
            <div>
              <h3>Wake the backup</h3>
              <p>
                Keep the <strong>Backup vault</strong> intact. Select it, choose{' '}
                <strong>Restore snapshot</strong>, then open the certificate to see what came back.
              </p>
            </div>
          </li>
        </ol>
        {(!entry || file.erasureRequested) && (
          <p className="guide-next">
            <strong>Next in Investigation</strong> {caseSteps(file, selected)[0].label}
          </p>
        )}
      </div>
      <div className="guide-footer">
        {entry ? (
          <>
            <button
              type="button"
              className="primary-button"
              data-sound-control
              onClick={() => leave('sound')}
            >
              <Volume2 size={18} />
              Enter with sound
            </button>
            <button
              type="button"
              className="quiet-entry"
              data-sound-control
              onClick={() => leave('silent')}
            >
              <VolumeX size={15} />
              Enter silently
            </button>
          </>
        ) : (
          <button type="button" className="primary-button" onClick={() => leave('back')}>
            Back to case
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    </dialog>
  );
}
