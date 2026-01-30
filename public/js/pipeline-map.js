document.addEventListener('DOMContentLoaded', () => {
  const dataUrl = '/data/pipeline-map.json';

  fetch(dataUrl)
    .then(r => {
      if (!r.ok) throw new Error('Failed to load map data');
      return r.json();
    })
    .then(data => {
      try {
        initMap(data);
      } catch (err) {
        console.error('Map init error:', err);
        const container = document.getElementById('pipeline-map');
        if (container) container.innerHTML = `<pre style="padding:12px;color:#900">Map initialization error:\n${escapeHtml(err && err.message ? err.message : String(err))}</pre>`;
      }
    })
    .catch(err => {
      console.error(err);
      const container = document.getElementById('pipeline-map');
      if (container) container.innerHTML = `<p style="padding:12px;color:#900">Unable to load map data: ${escapeHtml(err.message || String(err))}</p>`;
    });

  function initMap(data) {
    const center = data.center || { lat: 18.5204, lng: 73.8567, zoom: 12 };
    const map = L.map('pipeline-map').setView([center.lat, center.lng], center.zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    document.getElementById('map-last-updated').innerText = new Date(data.lastUpdated).toLocaleString();

    const destLayer = L.layerGroup();
    const plantLayer = L.layerGroup();
    const tankLayer = L.layerGroup();
    const cleaningLayer = L.layerGroup();
    const processLayer = L.layerGroup();
    const issueLayer = L.layerGroup();

    const iconBase = '/images/markers/';
    const destIcon = L.icon({ iconUrl: iconBase + 'destination.svg', iconSize: [28, 40], iconAnchor: [14, 40] });
    const plantIcon = L.icon({ iconUrl: iconBase + 'plant.svg', iconSize: [28, 40], iconAnchor: [14, 40] });
    const tankIcon = L.icon({ iconUrl: iconBase + 'tank.svg', iconSize: [28, 40], iconAnchor: [14, 40] });
    const cleanIcon = L.icon({ iconUrl: iconBase + 'cleaning.svg', iconSize: [28, 40], iconAnchor: [14, 40] });
    const procIcon = L.icon({ iconUrl: iconBase + 'process.svg', iconSize: [28, 40], iconAnchor: [14, 40] });
    const issueIcon = L.icon({ iconUrl: iconBase + 'issue.svg', iconSize: [28, 40], iconAnchor: [14, 40] });

    data.destinations && data.destinations.forEach(d => {
      const m = L.marker([d.lat, d.lng], { icon: destIcon }).bindPopup(`<strong>${escapeHtml(d.name)}</strong><br>${escapeHtml(d.notes || '')}`);
      destLayer.addLayer(m);
    });

    data.plants && data.plants.forEach(p => {
      const m = L.marker([p.lat, p.lng], { icon: plantIcon }).bindPopup(`<strong>${escapeHtml(p.name)}</strong><br>Capacity: ${p.capacity_mld || 'N/A'} MLD`);
      plantLayer.addLayer(m);
    });

    data.tanks && data.tanks.forEach(t => {
      const m = L.marker([t.lat, t.lng], { icon: tankIcon }).bindPopup(`<strong>${escapeHtml(t.name)}</strong><br>Volume: ${t.volume_m3 || 'N/A'} m³`);
      tankLayer.addLayer(m);
    });

    data.cleaningCenters && data.cleaningCenters.forEach(c => {
      const m = L.marker([c.lat, c.lng], { icon: cleanIcon }).bindPopup(`<strong>${escapeHtml(c.name)}</strong><br>${escapeHtml(c.notes || '')}`);
      cleaningLayer.addLayer(m);
    });

    data.processCenters && data.processCenters.forEach(pc => {
      const m = L.marker([pc.lat, pc.lng], { icon: procIcon }).bindPopup(`<strong>${escapeHtml(pc.name)}</strong><br>${escapeHtml(pc.notes || '')}`);
      processLayer.addLayer(m);
    });

    data.issues && data.issues.forEach(issue => {
      const eta = issue.eta_iso ? new Date(issue.eta_iso) : null;
      const etaText = eta ? `Estimated clearance: ${eta.toLocaleString()}` : 'ETA not available';
      const popup = `<strong>${escapeHtml(issue.title)}</strong><br>Type: ${escapeHtml(issue.type)}<br>Status: ${escapeHtml(issue.status)}<br>${escapeHtml(issue.notes || '')}<br><em>${etaText}</em>`;

      const m = L.marker([issue.lat, issue.lng], { icon: issueIcon }).bindPopup(popup);
      issueLayer.addLayer(m);
    });

    const overlays = {
      'Destinations': destLayer,
      'Plants': plantLayer,
      'Tanks': tankLayer,
      'Cleaning Centers': cleaningLayer,
      'Process Centers': processLayer,
      'Faults / Construction': issueLayer
    };

    destLayer.addTo(map);
    plantLayer.addTo(map);
    tankLayer.addTo(map);
    cleaningLayer.addTo(map);
    processLayer.addTo(map);
    issueLayer.addTo(map);

    L.control.layers(null, overlays, { collapsed: false }).addTo(map);

    // Fit bounds to all markers if available
    const all = L.featureGroup([destLayer, plantLayer, tankLayer, cleaningLayer, processLayer, issueLayer]);
    if (all.getLayers().length > 0) {
      map.fitBounds(all.getBounds().pad(0.2));
    }

    function escapeHtml(str) {
      if (!str) return '';
      return String(str).replace(/[&<>"']/g, function (s) {
        return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[s];
      });
    }
  }
});
