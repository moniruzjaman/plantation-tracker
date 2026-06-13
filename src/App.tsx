/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export default function App() {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <iframe 
        src="legacy-nursery.html" 
        style={{ display: 'block', width: '100%', height: '100%', border: 'none' }}
        title="Nursery Form" 
        allow="geolocation"
      />
    </div>
  );
}
