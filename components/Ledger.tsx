import { Layers3, ScanLine } from 'lucide-react';
import { STORES } from '../lib/case';
import type { CaseFile, StoreId } from '../lib/case';
import { clockTime, Status, STORE_ICONS } from './Common';

export function Ledger({
  file,
  selected,
  onSelect,
  onScan,
  busy
}: {
  file: CaseFile;
  selected: StoreId | null;
  onSelect: (id: StoreId) => void;
  onScan: () => void;
  busy: boolean;
}) {
  return (
    <section className="panel ledger" aria-labelledby="ledger-title">
      <div className="panel-bar">
        <h2 id="ledger-title">
          <Layers3 />
          Storage ledger <span className="number-tag">04</span>
        </h2>
        {file.stores.some((store) => store.checkedAt) && (
          <button className="text-button" disabled={busy} onClick={onScan}>
            <ScanLine size={15} />
            Recheck all locations
          </button>
        )}
      </div>
      <table>
        <thead>
          <tr>
            <th>Location</th>
            <th>Storage</th>
            <th>Finding</th>
            <th>
              Last checked <small>UTC</small>
            </th>
          </tr>
        </thead>
        <tbody>
          {file.stores.map((item) => {
            const store = STORES[item.id];
            const Icon = STORE_ICONS[item.id];
            return (
              <tr key={item.id} className={selected === item.id ? 'active-row' : ''}>
                <td>
                  <button
                    className="ledger-location"
                    aria-label={store.name + ' evidence'}
                    onClick={() => onSelect(item.id)}
                  >
                    <span className="store-icon">
                      <Icon size={16} />
                    </span>
                    {store.name}
                  </button>
                </td>
                <td>{store.technology}</td>
                <td>
                  <Status item={item} />
                </td>
                <td className="checked-time">{clockTime(item.checkedAt)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
