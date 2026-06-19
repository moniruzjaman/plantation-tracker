/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import NetworkStatus from './components/NetworkStatus';
import GeolocationIndicator from './components/GeolocationIndicator';

export default function App() {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
      <NetworkStatus />
      <GeolocationIndicator />
      <iframe 
        src="legacy-nursery.html" 
        style={{ display: 'block', width: '100%', height: '100%', border: 'none' }}
        title="Plantation Form" 
        allow="geolocation"
      />
    </div>
  );
}
