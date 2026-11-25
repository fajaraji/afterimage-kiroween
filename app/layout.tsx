import type { Metadata } from 'next';
import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-500.css';
import '@fontsource/dm-sans/latin-600.css';
import '@fontsource/dm-sans/latin-700.css';
import '@fontsource/germania-one/latin-400.css';
import './globals.css';
import './atlas.css';
import './guide.css';

export const metadata: Metadata = {
  title: 'Afterimage | Erasure investigation',
  description: 'Trace a fictional erasure request through a haunted storage map. Inspect the evidence that each copy leaves behind.'
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
