/**
 * ============================================================
 * GIS Module — বাংলাদেশ রোপণ ট্র্যাকার
 * ============================================================
 * MapLibre GL JS ভিত্তিক GIS মডিউল।
 * নির্ভরতা: maplibregl, MaplibreDraw, turf (CDN থেকে লোড)
 * ============================================================
 */

(function () {
  'use strict';

  /* ===========================================================
   * Section 1: Basemap Configurations
   * ===========================================================
   * ৭টি বেসম্যাপ স্টাইল ডিফাইন করা হলো।
   * প্রতিটি অবজেক্টে আছে: id, name (বাংলা), createStyle()
   * যা MapLibre-এর জন্য বৈধ style অবজেক্ট রিটার্ন করে।
   * =========================================================== */

  var BASEMAPS = [
    {
      id: 'street',
      name: '\u09B8\u09CD\u099F\u09CD\u09B0\u09BF\u099F', // স্ট্রিট
      createStyle: function () {
        return {
          version: 8,
          name: 'CartoDB Voyager',
          sources: {
            cartoVoyager: {
              type: 'raster',
              tiles: [
                'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
                'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
                'https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png'
              ],
              tileSize: 256,
              attribution: '\u00A9 <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> \u00A9 <a href="https://carto.com/" target="_blank">CARTO</a>'
            }
          },
          layers: [
            {
              id: 'cartoVoyagerLayer',
              type: 'raster',
              source: 'cartoVoyager',
              minzoom: 0,
              maxzoom: 22
            }
          ]
        };
      }
    },
    {
      id: 'satellite',
      name: '\u09B8\u09CD\u09AF\u09BE\u099F\u09C7\u09B2\u09BE\u0987\u099F', // স্যাটেলাইট
      createStyle: function () {
        return {
          version: 8,
          name: 'ESRI World Imagery',
          sources: {
            esriSatellite: {
              type: 'raster',
              tiles: [
                'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
              ],
              tileSize: 256,
              attribution: '\u00A9 <a href="https://www.esri.com/" target="_blank">Esri</a>'
            }
          },
          layers: [
            {
              id: 'esriSatelliteLayer',
              type: 'raster',
              source: 'esriSatellite',
              minzoom: 0,
              maxzoom: 22
            }
          ]
        };
      }
    },
    {
      id: 'terrain',
      name: '\u099F\u09C7\u09B0\u09C7\u0987\u09A8', // টেরেইন
      createStyle: function () {
        return {
          version: 8,
          name: 'OpenTopoMap',
          sources: {
            openTopo: {
              type: 'raster',
              tiles: [
                'https://a.tile.opentopomap.org/{z}/{x}/{y}.png',
                'https://b.tile.opentopomap.org/{z}/{x}/{y}.png',
                'https://c.tile.opentopomap.org/{z}/{x}/{y}.png'
              ],
              tileSize: 256,
              attribution: '\u00A9 <a href="https://opentopomap.org" target="_blank">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank">CC-BY-SA</a>)'
            }
          },
          layers: [
            {
              id: 'openTopoLayer',
              type: 'raster',
              source: 'openTopo',
              minzoom: 0,
              maxzoom: 17
            }
          ]
        };
      }
    },
    {
      id: 'hybrid',
      name: '\u09B9\u09BE\u0987\u09AC\u09CD\u09B0\u09BF\u09A1', // হাইব্রিড
      createStyle: function () {
        return {
          version: 8,
          name: 'ESRI Hybrid',
          sources: {
            esriImagery: {
              type: 'raster',
              tiles: [
                'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
              ],
              tileSize: 256,
              attribution: '\u00A9 <a href="https://www.esri.com/" target="_blank">Esri</a>'
            },
            esriLabels: {
              type: 'raster',
              tiles: [
                'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'
              ],
              tileSize: 256
            }
          },
          layers: [
            {
              id: 'esriImageryLayer',
              type: 'raster',
              source: 'esriImagery',
              minzoom: 0,
              maxzoom: 22
            },
            {
              id: 'esriLabelsLayer',
              type: 'raster',
              source: 'esriLabels',
              minzoom: 0,
              maxzoom: 22
            }
          ]
        };
      }
    },
    {
      id: 'dark',
      name: '\u09A1\u09BE\u09B0\u09CD\u0995', // ডার্ক
      createStyle: function () {
        return {
          version: 8,
          name: 'CartoDB Dark Matter',
          sources: {
            cartoDark: {
              type: 'raster',
              tiles: [
                'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
                'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
                'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png'
              ],
              tileSize: 256,
              attribution: '\u00A9 <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> \u00A9 <a href="https://carto.com/" target="_blank">CARTO</a>'
            }
          },
          layers: [
            {
              id: 'cartoDarkLayer',
              type: 'raster',
              source: 'cartoDark',
              minzoom: 0,
              maxzoom: 22
            }
          ]
        };
      }
    },
    {
      id: 'osm',
      name: 'OpenStreetMap',
      createStyle: function () {
        return {
          version: 8,
          name: 'OpenStreetMap',
          sources: {
            osmRaster: {
              type: 'raster',
              tiles: [
                'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
                'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
                'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
              ],
              tileSize: 256,
              attribution: '\u00A9 <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
            }
          },
          layers: [
            {
              id: 'osmRasterLayer',
              type: 'raster',
              source: 'osmRaster',
              minzoom: 0,
              maxzoom: 19
            }
          ]
        };
      }
    },
    {
      id: 'hrdi',
      name: '\u098F\u0987\u099A\u0986\u09B0\u09A1\u09BF', // এইচআরডি
      createStyle: function () {
        return {
          version: 8,
          name: 'HRDI Green Tint',
          sources: {
            osmForHrdi: {
              type: 'raster',
              tiles: [
                'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
                'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
                'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
              ],
              tileSize: 256,
              attribution: '\u00A9 <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors | HRDI'
            }
          },
          layers: [
            {
              id: 'osmHrdiLayer',
              type: 'raster',
              source: 'osmForHrdi',
              minzoom: 0,
              maxzoom: 19
            },
            {
              id: 'hrdiGreenTint',
              type: 'background',
              paint: {
                'background-color': 'rgba(34, 139, 34, 0.08)'
              }
            }
          ],
          light: {
            anchor: 'viewport',
            color: '#ffffff',
            intensity: 0.2,
            position: [1.15, 210, 30]
          }
        };
      }
    }
  ];

  /* ===========================================================
   * Section 5: Popup HTML Generator
   * ===========================================================
   * একটি সাবমিশন অবজেক্ট থেকে পপআপ HTML তৈরি করে।
   * Leaflet কোডের পপআপের সাথে মিল রেখে তৈরি।
   * =========================================================== */

  function generatePopupHTML(s) {
    var fD = 0, bD = 0, oD = 0;
    if (s.seedlings && s.seedlings.length) {
      for (var i = 0; i < s.seedlings.length; i++) {
        var cat = (s.seedlings[i].category || '').toLowerCase();
        var qty = parseInt(s.seedlings[i].quantity, 10) || 0;
        if (cat === 'fruit' || cat === '\u09AB\u09B2\u09A6') fD += qty;
        else if (cat === 'forest' || cat === '\u09AC\u09A8\u099C') bD += qty;
        else oD += qty;
      }
    }

    var breadCrumb = (s.region || '') + ' > ' + (s.district || '') + ' > ' + (s.upazila || '');

    var html = '<div style="font-family:system-ui,Tahoma,sans-serif;max-width:280px;font-size:13px;line-height:1.5;">';

    html += '<div style="font-weight:700;color:#16a34a;font-size:15px;margin-bottom:4px;">' +
      (s.farmerName || '\u0985\u099C\u09BE\u09A8\u09BE') + '</div>';

    if (s.farmerMobile) {
      html += '<div style="margin-bottom:3px;">\u09AE\u09CB\u09AC\u09BE\u0987\u09B2: <a href="tel:' + s.farmerMobile +
        '" style="color:#2563eb;text-decoration:none;">' + s.farmerMobile + '</a></div>';
    }

    if (s.officerName) {
      var officerLine = '\u09A6\u09BE\u09AF\u09BC\u09BF\u09A4\u09CD\u09AC\u09BF\u0995: ' + s.officerName;
      if (s.officerMobile) {
        officerLine += ' (<a href="tel:' + s.officerMobile + '" style="color:#2563eb;text-decoration:none;">' + s.officerMobile + '</a>)';
      }
      html += '<div style="margin-bottom:3px;">' + officerLine + '</div>';
    }

    if (s.plantingDate) {
      html += '<div style="margin-bottom:3px;">\u09A4\u09BE\u09B0\u09BF\u0996: ' + s.plantingDate + '</div>';
    }

    if (s.address) {
      html += '<div style="margin-bottom:3px;color:#555;">' + s.address + '</div>';
    }

    html += '<div style="margin-bottom:5px;font-size:12px;color:#6b7280;">' + breadCrumb + '</div>';

    html += '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-top:6px;">';
    html += '<div style="text-align:center;background:#FFF7ED;border:1px solid #FDBA74;border-radius:6px;padding:4px;">' +
      '<div style="color:#EA580C;font-weight:700;font-size:16px;">' + fD + '</div>' +
      '<div style="color:#9A3412;font-size:11px;">\u09AB\u09B2\u09A6</div></div>';
    html += '<div style="text-align:center;background:#F0FDF4;border:1px solid #86EFAC;border-radius:6px;padding:4px;">' +
      '<div style="color:#16A34A;font-weight:700;font-size:16px;">' + bD + '</div>' +
      '<div style="color:#166534;font-size:11px;">\u09AC\u09A8\u099C</div></div>';
    html += '<div style="text-align:center;background:#EFF6FF;border:1px solid #93C5FD;border-radius:6px;padding:4px;">' +
      '<div style="color:#2563EB;font-weight:700;font-size:16px;">' + oD + '</div>' +
      '<div style="color:#1E40AF;font-size:11px;">\u0994\u09B7\u09A7\u09BF</div></div>';
    html += '</div>';

    if (s._isMine && typeof editMySubmission === 'function') {
      html += '<div style="margin-top:8px;text-align:center;">' +
        '<button onclick="editMySubmission(\'' + s.submissionId + '\')" ' +
        'style="background:#16a34a;color:#fff;border:none;padding:5px 16px;border-radius:6px;cursor:pointer;font-size:13px;">' +
        '\u09B8\u09AE\u09CD\u09AA\u09BE\u09A6\u09A8\u09BE \u0995\u09B0\u09C1\u09A8</button></div>';
    }

    html += '</div>';
    return html;
  }

  /* ===========================================================
   * Section 2: PlantationGIS Class
   * =========================================================== */

  function PlantationGIS(containerId) {
    var self = this;

    /* --- Check MapLibre GL support --- */
    if (!maplibregl || !maplibregl.Map) {
      console.warn('[GIS] MapLibre GL JS \u09AA\u09BE\u0993\u09AF\u09BC\u09BE \u09AF\u09BE\u09AF\u09BC \u09A8\u09BF\u0964 \u09AE\u09BE\u09AA \u0987\u09A8\u09BF\u09B6\u09BF\u09AF\u09BC\u09BE\u09B2\u09BE\u0987\u099C \u09AC\u09CD\u09AF\u09B0\u09CD\u09A5 \u09B9\u099A\u09CD\u099B\u09C7 \u09A8\u09BE\u0964');
      self._supported = false;
      return;
    }
    self._supported = true;

    self.containerId = containerId;
    self.basemaps = [];
    self.activeBasemapId = 'street';
    self.layerDefs = [];
    self.drawMode = false;
    self.measuring = false;
    self.measureType = null;
    self.measurePoints = [];
    self.measureMarkers = [];
    self.measurePopup = null;
    self.myLocationMarker = null;
    self.boundaryPolygons = []; // for reverse geocoding
    self.boundaryIndex = { division: [], district: [], upazila: [], union: [] };

    /* --- Create map --- */
    var defaultStyle = null;
    for (var b = 0; b < BASEMAPS.length; b++) {
      if (BASEMAPS[b].id === 'street') {
        defaultStyle = BASEMAPS[b].createStyle();
        break;
      }
    }
    if (!defaultStyle) defaultStyle = BASEMAPS[0].createStyle();

    self.map = new maplibregl.Map({
      container: containerId,
      style: defaultStyle,
      center: [90.4125, 23.8103],
      zoom: 7,
      minZoom: 3,
      maxZoom: 18,
      attributionControl: false
    });

    /* --- Attribution --- */
    self.map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

    /* --- Navigation controls --- */
    self.map.addControl(new maplibregl.NavigationControl({ showCompass: true, showZoom: true }), 'bottom-left');

    /* --- Scale control --- */
    self.map.addControl(new maplibregl.ScaleControl({ maxWidth: 200, unit: 'metric' }), 'bottom-left');

    /* --- Init basemaps --- */
    self.initBasemaps();

    /* --- Init layers --- */
    self.initLayers();

    /* --- Init layer control panel --- */
    self.map.on('load', function () {
      try {
        self.initLayerControl();
        self.loadStoredGeometries();
        self.refreshMarkers();
        loadBangladeshBoundaries(self);
      } catch (err) {
        console.error('[GIS] Map load error:', err);
      }
    });

    /* --- Init draw tools --- */
    self.initDrawTools();

    /* --- Init measurement tools --- */
    self.initMeasurementTools();
  }

  /* ----- initBasemaps ----- */
  PlantationGIS.prototype.initBasemaps = function () {
    this.basemaps = BASEMAPS.map(function (bm) {
      return { id: bm.id, name: bm.name, createStyle: bm.createStyle };
    });
  };

  /* ----- switchBasemap ----- */
  PlantationGIS.prototype.switchBasemap = function (basemapId) {
    var self = this;
    if (!self.map || !self._supported) return;

    var target = null;
    for (var i = 0; i < self.basemaps.length; i++) {
      if (self.basemaps[i].id === basemapId) { target = self.basemaps[i]; break; }
    }
    if (!target) return;

    var style = self.map.getStyle();
    var overlaySources = [];
    var overlayLayers = [];

    /* Collect all overlay source IDs that we manage */
    var overlaySourceIds = [
      'plantation-points', 'plantation-polygons-src', 'nursery-points',
      'monitoring-points', 'dead-tree-points', 'missing-tree-points',
      'survival-geojson', 'ndvi-tiles', 'heatmap-geojson', 'density-geojson',
      'admin-division', 'admin-district', 'admin-upazila', 'admin-union',
      'draw-polygon-src', 'measure-points-src'
    ];

    if (style && style.layers) {
      for (var li = 0; li < style.layers.length; li++) {
        var layer = style.layers[li];
        if (overlaySourceIds.indexOf(layer.source) !== -1) {
          overlayLayers.push(layer);
          if (overlaySources.indexOf(layer.source) === -1) {
            overlaySources.push(layer.source);
          }
        }
      }
    }

    /* Build new style */
    var newStyle = target.createStyle();
    newStyle.layers = (newStyle.layers || []).concat(overlayLayers);

    if (style && style.sources) {
      for (var si = 0; si < overlaySources.length; si++) {
        if (style.sources[overlaySources[si]] && !newStyle.sources[overlaySources[si]]) {
          newStyle.sources[overlaySources[si]] = style.sources[overlaySources[si]];
        }
      }
    }

    self.activeBasemapId = basemapId;
    self.map.setStyle(newStyle);

    self.map.once('style.load', function () {
      self._restoreOverlays();
    });
  };

  /* ----- _restoreOverlays ----- (internal helper) */
  PlantationGIS.prototype._restoreOverlays = function () {
    var self = this;
    /* Re-add popups and markers need to be re-bound after style change */
    /* Refresh markers to re-attach event handlers */
    try {
      var entries = (typeof getMapEntries === 'function') ? getMapEntries() : [];
      self.addPlantationMarkers(entries);
      self.loadStoredGeometries();
    } catch (err) {
      console.error('[GIS] Error restoring overlays after basemap switch:', err);
    }
  };

  /* ----- initLayerControl ----- */
  PlantationGIS.prototype.initLayerControl = function () {
    var self = this;
    var container = self.map.getContainer();

    /* Create control panel */
    var panel = document.createElement('div');
    panel.id = 'gis-layer-control';
    panel.style.cssText = 'position:absolute;top:10px;right:10px;z-index:1000;' +
      'background:#ffffff;border-radius:10px;box-shadow:0 2px 12px rgba(0,0,0,0.18);' +
      'font-family:system-ui,Tahoma,sans-serif;font-size:13px;width:220px;' +
      'max-height:calc(100vh - 80px);overflow-y:auto;transition:transform 0.3s ease,opacity 0.3s ease;';

    /* Toggle button for mobile */
    var toggleBtn = document.createElement('div');
    toggleBtn.id = 'gis-control-toggle';
    toggleBtn.style.cssText = 'position:absolute;top:10px;right:10px;z-index:1001;' +
      'background:#ffffff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.2);' +
      'width:36px;height:36px;display:flex;align-items:center;justify-content:center;' +
      'cursor:pointer;font-size:18px;display:none;';
    toggleBtn.innerHTML = '\u2699';
    toggleBtn.title = '\u09B2\u09C7\u09AF\u09BC\u09BE\u09B0 \u0995\u09A8\u099F\u09CD\u09B0\u09CB\u09B2';
    toggleBtn.onclick = function () {
      if (panel.style.transform === 'translateX(calc(100% + 20px))' || panel.style.display === 'none') {
        panel.style.display = 'block';
        panel.style.transform = 'translateX(0)';
        panel.style.opacity = '1';
      } else {
        panel.style.transform = 'translateX(calc(100% + 20px))';
        panel.style.opacity = '0';
        setTimeout(function () { panel.style.display = 'none'; }, 300);
      }
    };
    container.appendChild(toggleBtn);

    /* Mobile detection */
    function checkMobile() {
      if (window.innerWidth < 768) {
        toggleBtn.style.display = 'flex';
        panel.style.transform = 'translateX(calc(100% + 20px))';
        panel.style.opacity = '0';
      } else {
        toggleBtn.style.display = 'none';
        panel.style.transform = 'translateX(0)';
        panel.style.opacity = '1';
        panel.style.display = 'block';
      }
    }
    checkMobile();
    window.addEventListener('resize', checkMobile);

    /* --- Basemap section --- */
    var sectionTitle = function (text) {
      var h = document.createElement('div');
      h.style.cssText = 'padding:8px 12px 4px;font-weight:700;font-size:12px;color:#374151;' +
        'border-bottom:1px solid #e5e7eb;text-transform:uppercase;letter-spacing:0.5px;';
      h.textContent = text;
      return h;
    };

    panel.appendChild(sectionTitle('\u09AC\u09C7\u09B8\u09AE\u09CD\u09AF\u09BE\u09AA'));

    var bmList = document.createElement('div');
    bmList.style.cssText = 'padding:6px 10px;';

    self.basemaps.forEach(function (bm) {
      var label = document.createElement('label');
      label.style.cssText = 'display:flex;align-items:center;gap:6px;padding:3px 0;cursor:pointer;font-size:12px;color:#1f2937;';

      var radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'gis-basemap';
      radio.value = bm.id;
      radio.checked = (bm.id === self.activeBasemapId);
      radio.style.cssText = 'accent-color:#16a34a;';
      radio.addEventListener('change', function () {
        self.switchBasemap(bm.id);
      });

      label.appendChild(radio);
      label.appendChild(document.createTextNode(bm.name));
      bmList.appendChild(label);
    });

    panel.appendChild(bmList);

    /* --- Layer toggles section --- */
    panel.appendChild(sectionTitle('\u09B2\u09C7\u09AF\u09BC\u09BE\u09B0'));

    var layerList = document.createElement('div');
    layerList.style.cssText = 'padding:6px 10px;max-height:220px;overflow-y:auto;';

    self.layerDefs.forEach(function (ld) {
      var label = document.createElement('label');
      label.style.cssText = 'display:flex;align-items:center;gap:6px;padding:3px 0;cursor:pointer;font-size:12px;color:#1f2937;';

      var cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = ld.visible;
      cb.style.cssText = 'accent-color:#16a34a;';
      cb.dataset.layerId = ld.id;
      cb.addEventListener('change', function () {
        self.toggleLayer(ld.id, cb.checked);
      });

      label.appendChild(cb);
      label.appendChild(document.createTextNode(ld.name));
      layerList.appendChild(label);
    });

    panel.appendChild(layerList);

    /* --- Drawing tools section --- */
    var drawSection = document.createElement('div');
    drawSection.id = 'gis-draw-section';
    drawSection.style.cssText = 'padding:6px 10px;border-top:1px solid #e5e7eb;display:none;';

    drawSection.appendChild(sectionTitle('\u0985\u0999\u09CD\u0995\u09A8 \u099F\u09C1\u09B2'));

    var drawBtns = [
      { icon: '\u25B3', label: '\u09AA\u09B2\u09BF\u0997\u09A8', mode: 'draw_polygon' },
      { icon: '\u25CF', label: '\u09AC\u09BF\u09A8\u09CD\u09A6\u09C1', mode: 'draw_point' },
      { icon: '\u270E', label: '\u09B8\u09AE\u09CD\u09AA\u09BE\u09A6\u09A8\u09BE', mode: 'simple_select' },
      { icon: '\u2716', label: '\u09AE\u09C1\u099B\u09C1\u09A8', mode: 'direct_select' }
    ];

    var btnRow = document.createElement('div');
    btnRow.style.cssText = 'display:flex;gap:4px;flex-wrap:wrap;padding:4px 0;';

    drawBtns.forEach(function (db) {
      var btn = document.createElement('button');
      btn.style.cssText = 'background:#f3f4f6;border:1px solid #d1d5db;border-radius:6px;' +
        'padding:4px 8px;cursor:pointer;font-size:12px;color:#374151;display:flex;align-items:center;gap:3px;';
      btn.innerHTML = '<span style="font-size:14px;">' + db.icon + '</span> ' + db.label;
      btn.onclick = function () {
        if (self.Draw) {
          self.Draw.changeMode(db.mode);
        }
      };
      btnRow.appendChild(btn);
    });

    drawSection.appendChild(btnRow);

    /* Measurement tools */
    var measureSection = document.createElement('div');
    measureSection.style.cssText = 'padding:4px 0;border-top:1px solid #e5e7eb;margin-top:4px;';

    var distBtn = document.createElement('button');
    distBtn.style.cssText = 'background:#dbeafe;border:1px solid #93c5fd;border-radius:6px;' +
      'padding:4px 10px;cursor:pointer;font-size:11px;color:#1e40af;margin-right:4px;';
    distBtn.textContent = '\u09A6\u09C2\u09B0\u09A4\u09CD\u09AC \u09AE\u09BE\u09AA\u09C1\u09A8';
    distBtn.onclick = function () { self.startMeasureDistance(); };

    var areaBtn = document.createElement('button');
    areaBtn.style.cssText = 'background:#dcfce7;border:1px solid #86efac;border-radius:6px;' +
      'padding:4px 10px;cursor:pointer;font-size:11px;color:#166534;margin-right:4px;';
    areaBtn.textContent = '\u0995\u09CD\u09B7\u09C7\u09A4\u09CD\u09B0\u09AB\u09B2 \u09AE\u09BE\u09AA\u09C1\u09A8';
    areaBtn.onclick = function () { self.startMeasureArea(); };

    var clearBtn = document.createElement('button');
    clearBtn.style.cssText = 'background:#fee2e2;border:1px solid #fca5a5;border-radius:6px;' +
      'padding:4px 10px;cursor:pointer;font-size:11px;color:#991b1b;';
    clearBtn.textContent = '\u09AE\u09C1\u099B\u09C1\u09A8';
    clearBtn.onclick = function () { self.clearMeasurement(); };

    measureSection.appendChild(distBtn);
    measureSection.appendChild(areaBtn);
    measureSection.appendChild(clearBtn);

    drawSection.appendChild(measureSection);
    panel.appendChild(drawSection);

    container.appendChild(panel);
    self._controlPanel = panel;
    self._drawSection = drawSection;
  };

  /* ----- initLayers ----- */
  PlantationGIS.prototype.initLayers = function () {
    var self = this;

    self.layerDefs = [
      {
        id: 'plantation-markers',
        name: '\u09B0\u09CB\u09AA\u09A3 \u09B8\u09CD\u09A5\u09BE\u09A8',
        visible: true,
        type: 'circle',
        source: null,
        layer: null
      },
      {
        id: 'plantation-polygons',
        name: '\u09B0\u09CB\u09AA\u09A3 \u09B8\u09C0\u09AE\u09BE\u09A8\u09BE',
        visible: true,
        type: 'fill',
        source: null,
        layer: null
      },
      {
        id: 'nursery-markers',
        name: '\u09A8\u09BE\u09B0\u09CD\u09B8\u09BE\u09B0\u09C0',
        visible: false,
        type: 'symbol',
        source: null,
        layer: null
      },
      {
        id: 'monitoring-visits',
        name: '\u09AE\u09A8\u09BF\u099F\u09B0\u09BF\u0982 \u09AD\u09BF\u099C\u09BF\u099F',
        visible: false,
        type: 'circle',
        source: null,
        layer: null
      },
      {
        id: 'dead-trees',
        name: '\u09AE\u09C3\u09A4 \u0997\u09BE\u099B',
        visible: false,
        type: 'symbol',
        source: null,
        layer: null
      },
      {
        id: 'missing-trees',
        name: '\u09B9\u09BE\u09B0\u09BE\u09A8\u09CB \u0997\u09BE\u099B',
        visible: false,
        type: 'symbol',
        source: null,
        layer: null
      },
      {
        id: 'survival-percent',
        name: '\u099F\u09BF\u0995\u09BE \u09B9\u09BE\u09B0 (%)',
        visible: false,
        type: 'fill',
        source: null,
        layer: null
      },
      {
        id: 'ndvi-layer',
        name: 'NDVI \u09B2\u09C7\u09AF\u09BC\u09BE\u09B0',
        visible: false,
        type: 'raster',
        source: null,
        layer: null
      },
      {
        id: 'heatmap-layer',
        name: '\u09B9\u09BF\u099F\u09AE\u09CD\u09AF\u09BE\u09AA',
        visible: false,
        type: 'heatmap',
        source: null,
        layer: null
      },
      {
        id: 'density-map',
        name: '\u0998\u09A8\u09A4\u09CD\u09AC \u09AE\u09BE\u09A8\u099A\u09BF\u09A4\u09CD\u09B0',
        visible: false,
        type: 'fill',
        source: null,
        layer: null
      },
      {
        id: 'admin-boundaries',
        name: '\u09AA\u09CD\u09B0\u09B6\u09BE\u09B8\u09A8\u09BF\u0995 \u09B8\u09C0\u09AE\u09BE\u09A8\u09BE',
        visible: true,
        type: 'line',
        source: null,
        layer: null
      }
    ];
  };

  /* ----- toggleLayer ----- */
  PlantationGIS.prototype.toggleLayer = function (layerId, visible) {
    var self = this;
    if (!self.map || !self._supported) return;

    var ld = null;
    for (var i = 0; i < self.layerDefs.length; i++) {
      if (self.layerDefs[i].id === layerId) { ld = self.layerDefs[i]; break; }
    }
    if (!ld) return;

    ld.visible = visible;

    /* For admin-boundaries, toggle multiple sub-layers */
    if (layerId === 'admin-boundaries') {
      var adminLayers = ['admin-division-line', 'admin-district-line', 'admin-upazila-line', 'admin-union-line'];
      adminLayers.forEach(function (lid) {
        try {
          if (self.map.getLayer(lid)) {
            self.map.setLayoutProperty(lid, 'visibility', visible ? 'visible' : 'none');
          }
        } catch (e) { /* ignore */ }
      });
      return;
    }

    /* For plantation-polygons, toggle both fill and outline */
    if (layerId === 'plantation-polygons') {
      try {
        if (self.map.getLayer('plantation-polygon-fill')) {
          self.map.setLayoutProperty('plantation-polygon-fill', 'visibility', visible ? 'visible' : 'none');
        }
        if (self.map.getLayer('plantation-polygon-outline')) {
          self.map.setLayoutProperty('plantation-polygon-outline', 'visibility', visible ? 'visible' : 'none');
        }
      } catch (e) { /* ignore */ }
      return;
    }

    /* For heatmap, toggle circle layer too */
    if (layerId === 'heatmap-layer') {
      try {
        if (self.map.getLayer('heatmap-heat')) {
          self.map.setLayoutProperty('heatmap-heat', 'visibility', visible ? 'visible' : 'none');
        }
        if (self.map.getLayer('heatmap-point')) {
          self.map.setLayoutProperty('heatmap-point', 'visibility', visible ? 'visible' : 'none');
        }
      } catch (e) { /* ignore */ }
      return;
    }

    /* For density-map, toggle grid fill and outline */
    if (layerId === 'density-map') {
      try {
        if (self.map.getLayer('density-fill')) {
          self.map.setLayoutProperty('density-fill', 'visibility', visible ? 'visible' : 'none');
        }
        if (self.map.getLayer('density-outline')) {
          self.map.setLayoutProperty('density-outline', 'visibility', visible ? 'visible' : 'none');
        }
      } catch (e) { /* ignore */ }
      return;
    }

    /* Generic toggle */
    var layerName = layerId + '-layer';
    try {
      if (self.map.getLayer(layerName)) {
        self.map.setLayoutProperty(layerName, 'visibility', visible ? 'visible' : 'none');
      }
    } catch (e) { /* ignore */ }
  };

  /* ----- addPlantationMarkers ----- */
  PlantationGIS.prototype.addPlantationMarkers = function (entries) {
    var self = this;
    if (!self.map || !self._supported || !entries) return;

    var features = [];
    var profile = (typeof getProfile === 'function') ? getProfile() : {};

    for (var i = 0; i < entries.length; i++) {
      var s = entries[i];

      /* Resolve lat/lng from geoLocation string OR separate lat/lng fields */
      var lat, lng;
      if (s.geoLocation) {
        var parts = s.geoLocation.split(',');
        lat = parseFloat(parts[0]);
        lng = parseFloat(parts[1]);
      } else if (s.latitude && s.longitude) {
        lat = parseFloat(s.latitude);
        lng = parseFloat(s.longitude);
      }
      if (isNaN(lat) || isNaN(lng)) continue;

      var color = '#9CA3AF'; // default gray
      if (typeof upazilaColor === 'function' && s.upazila) {
        color = upazilaColor(s.upazila);
      }
      if (s._isMine) {
        color = '#A855F7'; // purple for own
      }

      var totalSeedlings = 0;
      if (typeof countSeedlings === 'function') {
        totalSeedlings = countSeedlings(s);
      } else if (s.seedlings) {
        for (var j = 0; j < s.seedlings.length; j++) {
          totalSeedlings += parseInt(s.seedlings[j].quantity, 10) || 0;
        }
      }

      features.push({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [lng, lat] },
        properties: {
          id: s.submissionId,
          color: color,
          farmerName: s.farmerName || '',
          farmerMobile: s.farmerMobile || '',
          officerName: s.officerName || '',
          officerMobile: s.officerMobile || '',
          plantingDate: s.plantingDate || '',
          address: s.address || '',
          region: s.region || '',
          district: s.district || '',
          upazila: s.upazila || '',
          union: s.union || '',
          village: s.village || '',
          totalSeedlings: totalSeedlings,
          seedlings: s.seedlings || [],
          _isMine: s._isMine || false,
          ndvi: s.ndvi || '',
          _source: s._source || 'local',
          _raw: JSON.stringify(s)
        }
      });
    }

    var geojson = { type: 'FeatureCollection', features: features };

    /* Remove existing source/layers if they exist */
    try {
      if (self.map.getLayer('plantation-markers-layer')) self.map.removeLayer('plantation-markers-layer');
      if (self.map.getLayer('plantation-markers-label')) self.map.removeLayer('plantation-markers-label');
      if (self.map.getSource('plantation-points')) self.map.removeSource('plantation-points');
    } catch (e) { /* ignore */ }

    if (features.length === 0) return;

    self.map.addSource('plantation-points', {
      type: 'geojson',
      data: geojson,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50
    });

    /* Cluster circles */
    self.map.addLayer({
      id: 'plantation-clusters',
      type: 'circle',
      source: 'plantation-points',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': [
          'step', ['get', 'point_count'],
          '#51CF66', 10,
          '#FCC419', 50,
          '#FF6B6B'
        ],
        'circle-radius': [
          'step', ['get', 'point_count'],
          18, 10,
          24, 50,
          30
        ],
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff'
      }
    });

    /* Cluster count labels */
    self.map.addLayer({
      id: 'plantation-cluster-count',
      type: 'symbol',
      source: 'plantation-points',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-size': 12,
        'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold']
      },
      paint: {
        'text-color': '#ffffff'
      }
    });

    /* Individual markers */
    self.map.addLayer({
      id: 'plantation-markers-layer',
      type: 'circle',
      source: 'plantation-points',
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': ['get', 'color'],
        'circle-radius': 7,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff',
        'circle-opacity': 0.9
      }
    });

    /* Popups on click */
    self.map.on('click', 'plantation-markers-layer', function (e) {
      if (!e.features || !e.features.length) return;
      var props = e.features[0].properties;
      var s = {};
      try { s = JSON.parse(props._raw); } catch (err) { s = props; }

      var coordinates = e.features[0].geometry.coordinates.slice();
      var popupHTML = generatePopupHTML(s);

      new maplibregl.Popup({ offset: 12, maxWidth: '300px', closeButton: true })
        .setLngLat(coordinates)
        .setHTML(popupHTML)
        .addTo(self.map);
    });

    /* Cluster click — zoom in */
    self.map.on('click', 'plantation-clusters', function (e) {
      var features = self.map.queryRenderedFeatures(e.point, { layers: ['plantation-clusters'] });
      var clusterId = features[0].properties.cluster_id;
      self.map.getSource('plantation-points').getClusterExpansionZoom(clusterId, function (err, zoom) {
        if (err) return;
        self.map.easeTo({
          center: features[0].geometry.coordinates,
          zoom: zoom
        });
      });
    });

    /* Cursor change */
    self.map.on('mouseenter', 'plantation-markers-layer', function () {
      self.map.getCanvas().style.cursor = 'pointer';
    });
    self.map.on('mouseleave', 'plantation-markers-layer', function () {
      self.map.getCanvas().style.cursor = '';
    });

    /* Update heatmap if visible */
    self._updateHeatmap(geojson);

    /* Update density map if visible */
    self._updateDensityMap(features);

    /* Update stats text */
    self._updateStats(entries);
  };

  /* ----- _updateHeatmap (internal) ----- */
  PlantationGIS.prototype._updateHeatmap = function (geojson) {
    var self = this;
    try {
      if (self.map.getLayer('heatmap-heat')) self.map.removeLayer('heatmap-heat');
      if (self.map.getLayer('heatmap-point')) self.map.removeLayer('heatmap-point');
      if (self.map.getSource('heatmap-geojson')) self.map.removeSource('heatmap-geojson');
    } catch (e) { /* ignore */ }

    self.map.addSource('heatmap-geojson', {
      type: 'geojson',
      data: geojson
    });

    self.map.addLayer({
      id: 'heatmap-heat',
      type: 'heatmap',
      source: 'heatmap-geojson',
      maxzoom: 15,
      paint: {
        'heatmap-weight': 1,
        'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 15, 3],
        'heatmap-color': [
          'interpolate', ['linear'], ['heatmap-density'],
          0, 'rgba(33,102,172,0)',
          0.2, 'rgba(103,169,207,0.5)',
          0.4, 'rgba(209,229,240,0.8)',
          0.6, 'rgba(253,174,97,0.8)',
          0.8, 'rgba(244,109,67,0.8)',
          1, 'rgba(215,25,28,1)'
        ],
        'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 10, 15, 40],
        'heatmap-opacity': 0.7
      }
    });

    self.map.addLayer({
      id: 'heatmap-point',
      type: 'circle',
      source: 'heatmap-geojson',
      minzoom: 12,
      paint: {
        'circle-radius': 3,
        'circle-color': '#16a34a',
        'circle-stroke-width': 1,
        'circle-stroke-color': '#ffffff'
      }
    });

    /* Apply current visibility */
    var hmDef = null;
    for (var i = 0; i < self.layerDefs.length; i++) {
      if (self.layerDefs[i].id === 'heatmap-layer') { hmDef = self.layerDefs[i]; break; }
    }
    if (hmDef) {
      self.toggleLayer('heatmap-layer', hmDef.visible);
    }
  };

  /* ----- _updateDensityMap (internal) ----- */
  PlantationGIS.prototype._updateDensityMap = function (features) {
    var self = this;
    if (!turf) return;

    try {
      if (self.map.getLayer('density-fill')) self.map.removeLayer('density-fill');
      if (self.map.getLayer('density-outline')) self.map.removeLayer('density-outline');
      if (self.map.getSource('density-geojson')) self.map.removeSource('density-geojson');
    } catch (e) { /* ignore */ }

    if (!features || features.length === 0) return;

    /* Create a grid covering Bangladesh */
    var collection = { type: 'FeatureCollection', features: features };
    var bbox = [88.0, 20.5, 92.7, 26.6];

    try {
      var grid = turf.squareGrid(bbox, 0.5, { units: 'degrees' });
      var counted = turf.collect(grid, collection, 'totalSeedlings', 'values');

      var maxCount = 0;
      for (var i = 0; i < counted.features.length; i++) {
        var vals = counted.features[i].properties.values || [];
        var sum = 0;
        for (var j = 0; j < vals.length; j++) { sum += (parseInt(vals[j], 10) || 0); }
        counted.features[i].properties.count = sum;
        if (sum > maxCount) maxCount = sum;
      }

      self.map.addSource('density-geojson', {
        type: 'geojson',
        data: counted
      });

      self.map.addLayer({
        id: 'density-fill',
        type: 'fill',
        source: 'density-geojson',
        paint: {
          'fill-color': [
            'interpolate', ['linear'], ['get', 'count'],
            0, '#f0fdf4',
            Math.max(1, maxCount * 0.25), '#bbf7d0',
            Math.max(2, maxCount * 0.5), '#4ade80',
            Math.max(3, maxCount * 0.75), '#16a34a',
            Math.max(4, maxCount), '#14532d'
          ],
          'fill-opacity': 0.6
        }
      });

      self.map.addLayer({
        id: 'density-outline',
        type: 'line',
        source: 'density-geojson',
        paint: {
          'line-color': '#16a34a',
          'line-width': 0.5,
          'line-opacity': 0.4
        }
      });
    } catch (e) {
      console.warn('[GIS] Density map error:', e);
    }
  };

  /* ----- _updateStats (internal) ----- */
  PlantationGIS.prototype._updateStats = function (entries) {
    var statsEl = document.getElementById('mapStatsText');
    if (!statsEl) return;

    var totalCount = entries ? entries.length : 0;
    var totalSeedlings = 0;
    var syncedCount = 0;

    for (var i = 0; i < entries.length; i++) {
      var s = entries[i];
      if (typeof countSeedlings === 'function') {
        totalSeedlings += countSeedlings(s);
      }
      if (s._source !== 'local') {
        syncedCount++;
      }
    }

    statsEl.textContent = '\u09AE\u09CB\u099F: ' + totalCount +
      ' | \u099A\u09BE\u09B0\u09BE: ' + totalSeedlings +
      ' | \u09B8\u09BF\u0982\u0995: ' + syncedCount;
  };

  /* ----- addAdminBoundaries ----- */
  PlantationGIS.prototype.addAdminBoundaries = function (geojson, level) {
    var self = this;
    if (!self.map || !self._supported || !geojson || !geojson.features) return;

    var sourceId = 'admin-' + level;
    var layerId = 'admin-' + level + '-line';

    try {
      if (self.map.getLayer(layerId)) self.map.removeLayer(layerId);
      if (self.map.getSource(sourceId)) self.map.removeSource(sourceId);
    } catch (e) { /* ignore */ }

    self.map.addSource(sourceId, {
      type: 'geojson',
      data: geojson
    });

    var colors = {
      division: { line: '#6366F1', fill: 'rgba(99,102,241,0.05)', width: 2 },
      district: { line: '#F59E0B', fill: 'rgba(245,158,11,0.04)', width: 1.5 },
      upazila: { line: '#10B981', fill: 'rgba(16,185,129,0.03)', width: 1 },
      union: { line: '#EC4899', fill: 'rgba(236,72,153,0.02)', width: 0.5 }
    };

    var style = colors[level] || colors.district;

    self.map.addLayer({
      id: layerId + '-fill',
      type: 'fill',
      source: sourceId,
      paint: {
        'fill-color': style.fill,
        'fill-opacity': 1
      }
    });

    self.map.addLayer({
      id: layerId,
      type: 'line',
      source: sourceId,
      paint: {
        'line-color': style.line,
        'line-width': style.width,
        'line-opacity': 0.7
      }
    });

    /* Hover effect */
    self.map.on('mouseenter', layerId + '-fill', function () {
      self.map.getCanvas().style.cursor = 'pointer';
    });
    self.map.on('mouseleave', layerId + '-fill', function () {
      self.map.getCanvas().style.cursor = '';
    });

    self.map.on('click', layerId + '-fill', function (e) {
      if (!e.features || !e.features.length) return;
      var props = e.features[0].properties;
      var name = props.NAME || props.name || props.NAME_BN || '';
      var popup = new maplibregl.Popup({ closeButton: true, maxWidth: '200px' })
        .setLngLat(e.lngLat)
        .setHTML('<div style="font-size:13px;padding:4px;">' +
          '<strong>' + name + '</strong>' +
          (props.NAME_BN ? '<br>' + props.NAME_BN : '') +
          '</div>')
        .addTo(self.map);
    });

    /* Store for reverse geocoding */
    for (var i = 0; i < geojson.features.length; i++) {
      var f = geojson.features[i];
      if (f.geometry && f.geometry.type === 'Polygon') {
        self.boundaryPolygons.push({
          level: level,
          polygon: f,
          name: f.properties.NAME || f.properties.name || '',
          nameBn: f.properties.NAME_BN || f.properties.name_bn || ''
        });
      } else if (f.geometry && f.geometry.type === 'MultiPolygon') {
        /* Decompose MultiPolygon into individual Polygons for pointInPolygon */
        var coords = f.geometry.coordinates;
        for (var c = 0; c < coords.length; c++) {
          self.boundaryPolygons.push({
            level: level,
            polygon: { type: 'Feature', geometry: { type: 'Polygon', coordinates: coords[c] }, properties: f.properties },
            name: f.properties.NAME || f.properties.name || '',
            nameBn: f.properties.NAME_BN || f.properties.name_bn || ''
          });
        }
      }
      self.boundaryIndex[level].push(f);
    }

    /* Set visibility from layer def */
    var adminDef = null;
    for (var j = 0; j < self.layerDefs.length; j++) {
      if (self.layerDefs[j].id === 'admin-boundaries') { adminDef = self.layerDefs[j]; break; }
    }
    if (adminDef) {
      self.toggleLayer('admin-boundaries', adminDef.visible);
    }
  };

  /* ----- reverseGeocodeWithBounds ----- */
  PlantationGIS.prototype.reverseGeocodeWithBounds = function (lat, lng) {
    var self = this;
    var result = { division: '', district: '', upazila: '', union: '', village: '' };

    if (!turf) return result;

    var pt = turf.point([lng, lat]);
    var levels = ['union', 'upazila', 'district', 'division'];

    for (var l = 0; l < levels.length; l++) {
      var level = levels[l];
      for (var i = 0; i < self.boundaryPolygons.length; i++) {
        var bp = self.boundaryPolygons[i];
        if (bp.level !== level) continue;
        try {
          if (turf.booleanPointInPolygon(pt, bp.polygon)) {
            result[level] = bp.nameBn || bp.name;
          }
        } catch (e) {
          /* Skip polygons that cause errors (e.g., invalid geometry) */
        }
      }
    }

    return result;
  };

  /* ----- initDrawTools ----- */
  PlantationGIS.prototype.initDrawTools = function () {
    var self = this;
    if (!self._supported) return;

    if (typeof MaplibreDraw === 'undefined') {
      console.warn('[GIS] MaplibreDraw \u09AA\u09BE\u0993\u09AF\u09BC\u09BE \u09AF\u09BE\u09AF\u09BC \u09A8\u09BF\u0964');
      return;
    }

    self.map.on('load', function () {
      try {
        self.Draw = new MaplibreDraw({
          displayControlsDefault: false,
          controls: {},
          styles: [
            {
              id: 'gl-draw-polygon-fill',
              type: 'fill',
              filter: ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
              paint: {
                'fill-color': '#D20C39',
                'fill-outline-color': '#D20C39',
                'fill-opacity': 0.2
              }
            },
            {
              id: 'gl-draw-polygon-stroke-active',
              type: 'line',
              filter: ['all', ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
              layout: {
                'line-cap': 'round',
                'line-join': 'round'
              },
              paint: {
                'line-color': '#D20C39',
                'line-width': 2
              }
            },
            {
              id: 'gl-draw-polygon-fill-static',
              type: 'fill',
              filter: ['all', ['==', '$type', 'Polygon'], ['==', 'mode', 'static']],
              paint: {
                'fill-color': '#16a34a',
                'fill-outline-color': '#16a34a',
                'fill-opacity': 0.15
              }
            },
            {
              id: 'gl-draw-polygon-stroke-static',
              type: 'line',
              filter: ['all', ['==', '$type', 'Polygon'], ['==', 'mode', 'static']],
              layout: {
                'line-cap': 'round',
                'line-join': 'round'
              },
              paint: {
                'line-color': '#16a34a',
                'line-width': 2
              }
            },
            {
              id: 'gl-draw-point',
              type: 'circle',
              filter: ['all', ['==', '$type', 'Point'], ['!=', 'mode', 'static']],
              paint: {
                'circle-radius': 6,
                'circle-color': '#D20C39',
                'circle-stroke-width': 2,
                'circle-stroke-color': '#ffffff'
              }
            },
            {
              id: 'gl-draw-point-static',
              type: 'circle',
              filter: ['all', ['==', '$type', 'Point'], ['==', 'mode', 'static']],
              paint: {
                'circle-radius': 6,
                'circle-color': '#16a34a',
                'circle-stroke-width': 2,
                'circle-stroke-color': '#ffffff'
              }
            },
            {
              id: 'gl-draw-line',
              type: 'line',
              filter: ['all', ['==', '$type', 'LineString'], ['!=', 'mode', 'static']],
              layout: {
                'line-cap': 'round',
                'line-join': 'round'
              },
              paint: {
                'line-color': '#D20C39',
                'line-width': 2
              }
            }
          ]
        });

        self.map.addControl(self.Draw, 'top-left');

        /* Show/hide draw section based on mode changes */
        self.Draw.on('modechange', function (e) {
          self.drawMode = (e.mode !== 'simple_select' && e.mode !== 'direct_select') || self.Draw.getMode() !== 'simple_select';
          if (self._drawSection) {
            self._drawSection.style.display = 'block';
          }
        });

        self.Draw.on('create', function (e) { self.onDrawCreate(e); });
        self.Draw.on('update', function (e) { self.onDrawUpdate(e); });
        self.Draw.on('delete', function (e) { self.onDrawDelete(e); });

        /* Show draw section toggle */
        if (self._drawSection) {
          self._drawSection.style.display = 'block';
        }
      } catch (err) {
        console.error('[GIS] Draw tools init error:', err);
      }
    });
  };

  /* ----- onDrawCreate ----- */
  PlantationGIS.prototype.onDrawCreate = function (event) {
    var self = this;
    if (!event.features) return;

    for (var i = 0; i < event.features.length; i++) {
      var feature = event.features[i];
      self.storeGeometry(feature);

      /* Calculate area for polygons */
      if (turf && feature.geometry && feature.geometry.type === 'Polygon') {
        try {
          var areaSqMeters = turf.area(feature);
          var displayArea = '';
          if (areaSqMeters > 4046.8564224) {
            displayArea = (areaSqMeters / 4046.8564224).toFixed(2) + ' \u098F\u0995\u09B0';
          } else {
            displayArea = areaSqMeters.toFixed(1) + ' \u09AC\u09B0\u09CD\u0997\u09AE\u09BF\u099F\u09BE\u09B0';
          }

          var center = turf.centerOfMass(feature);
          new maplibregl.Popup({ offset: 10, closeButton: true })
            .setLngLat(center.geometry.coordinates)
            .setHTML('<div style="font-size:13px;padding:4px;">' +
              '<strong>\u0995\u09CD\u09B7\u09C7\u09A4\u09CD\u09B0\u09AB\u09B2:</strong> ' + displayArea + '</div>')
            .addTo(self.map);
        } catch (e) {
          console.warn('[GIS] Area calculation error:', e);
        }
      }
    }
  };

  /* ----- onDrawUpdate ----- */
  PlantationGIS.prototype.onDrawUpdate = function (event) {
    var self = this;
    if (!event.features) return;

    for (var i = 0; i < event.features.length; i++) {
      self.storeGeometry(event.features[i]);
    }
  };

  /* ----- onDrawDelete ----- */
  PlantationGIS.prototype.onDrawDelete = function (event) {
    var self = this;
    if (!event.features) return;

    try {
      var stored = JSON.parse(localStorage.getItem('plantation_geometries') || '[]');
      for (var i = 0; i < event.features.length; i++) {
        var delId = event.features[i].id;
        stored = stored.filter(function (g) { return g.id !== delId; });
      }
      localStorage.setItem('plantation_geometries', JSON.stringify(stored));
    } catch (e) {
      console.warn('[GIS] Error deleting geometry from storage:', e);
    }
  };

  /* ----- storeGeometry ----- */
  PlantationGIS.prototype.storeGeometry = function (feature) {
    try {
      var stored = JSON.parse(localStorage.getItem('plantation_geometries') || '[]');
      var existing = false;
      for (var i = 0; i < stored.length; i++) {
        if (stored[i].id === feature.id) {
          stored[i] = feature;
          existing = true;
          break;
        }
      }
      if (!existing) {
        stored.push(feature);
      }
      localStorage.setItem('plantation_geometries', JSON.stringify(stored));
    } catch (e) {
      console.warn('[GIS] Error storing geometry:', e);
    }
  };

  /* ----- loadStoredGeometries ----- */
  PlantationGIS.prototype.loadStoredGeometries = function () {
    var self = this;
    if (!self.map || !self._supported || !self.Draw) return;

    try {
      var stored = JSON.parse(localStorage.getItem('plantation_geometries') || '[]');
      if (stored.length === 0) return;

      for (var i = 0; i < stored.length; i++) {
        try {
          self.Draw.add(stored[i]);
        } catch (e) {
          /* Feature may already exist on the map */
        }
      }
    } catch (e) {
      console.warn('[GIS] Error loading stored geometries:', e);
    }
  };

  /* ----- initMeasurementTools ----- */
  PlantationGIS.prototype.initMeasurementTools = function () {
    var self = this;
    if (!self._supported) return;

    self.map.on('load', function () {
      /* Add source for measure points */
      try {
        if (!self.map.getSource('measure-points-src')) {
          self.map.addSource('measure-points-src', {
            type: 'geojson',
            data: { type: 'FeatureCollection', features: [] }
          });
        }

        self.map.addLayer({
          id: 'measure-points-layer',
          type: 'circle',
          source: 'measure-points-src',
          paint: {
            'circle-radius': 5,
            'circle-color': '#2563EB',
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff'
          }
        });

        self.map.addLayer({
          id: 'measure-line-layer',
          type: 'line',
          source: 'measure-points-src',
          layout: {
            'line-cap': 'round',
            'line-join': 'round'
          },
          paint: {
            'line-color': '#2563EB',
            'line-width': 2,
            'line-dasharray': [2, 2]
          }
        });

        /* Hide measurement layers initially */
        self.map.setLayoutProperty('measure-points-layer', 'visibility', 'none');
        self.map.setLayoutProperty('measure-line-layer', 'visibility', 'none');
      } catch (e) {
        console.warn('[GIS] Measurement layer init error:', e);
      }
    });

    /* Click handler for measurement */
    self.map.on('click', function (e) {
      if (!self.measuring) return;
      self._addMeasurePoint(e.lngLat.lng, e.lngLat.lat);
    });

    /* Escape key to clear measurement */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && self.measuring) {
        self.clearMeasurement();
      }
    });
  };

  /* ----- startMeasureDistance ----- */
  PlantationGIS.prototype.startMeasureDistance = function () {
    var self = this;
    self.clearMeasurement();
    self.measuring = true;
    self.measureType = 'distance';
    self.measurePoints = [];

    self.map.getCanvas().style.cursor = 'crosshair';

    try {
      self.map.setLayoutProperty('measure-points-layer', 'visibility', 'visible');
      self.map.setLayoutProperty('measure-line-layer', 'visibility', 'visible');
    } catch (e) { /* ignore */ }

    /* Show a notification */
    self._showMeasureNotification('\u09A6\u09C2\u09B0\u09A4\u09CD\u09AC \u09AE\u09BE\u09AA\u09A4\u09C7 \u09AE\u09CD\u09AF\u09BE\u09AA\u09C7 \u0995\u09CD\u09B2\u09BF\u0995 \u0995\u09B0\u09C1\u09A8\u0964 Esc \u099A\u09BE\u09AA\u09C1\u09A8 \u09AE\u09C1\u099B\u09A4\u09C7\u0964');
  };

  /* ----- startMeasureArea ----- */
  PlantationGIS.prototype.startMeasureArea = function () {
    var self = this;
    self.clearMeasurement();
    self.measuring = true;
    self.measureType = 'area';
    self.measurePoints = [];

    self.map.getCanvas().style.cursor = 'crosshair';

    try {
      self.map.setLayoutProperty('measure-points-layer', 'visibility', 'visible');
      self.map.setLayoutProperty('measure-line-layer', 'visibility', 'visible');
    } catch (e) { /* ignore */ }

    self._showMeasureNotification('\u0995\u09CD\u09B7\u09C7\u09A4\u09CD\u09B0\u09AB\u09B2 \u09AE\u09BE\u09AA\u09A4\u09C7 \u09AE\u09CD\u09AF\u09BE\u09AA\u09C7 \u0995\u09CD\u09B2\u09BF\u0995 \u0995\u09B0\u09C1\u09A8\u0964 \u09B6\u09C7\u09B7 \u09AC\u09BF\u09A8\u09CD\u09A6\u09C1\u09A4\u09C7 \u09A1\u09AC\u09B2-\u0995\u09CD\u09B2\u09BF\u0995 \u0995\u09B0\u09C1\u09A8\u0964 Esc \u099A\u09BE\u09AA\u09C1\u09A8 \u09AE\u09C1\u099B\u09A4\u09C7\u0964');
  };

  /* ----- _addMeasurePoint (internal) ----- */
  PlantationGIS.prototype._addMeasurePoint = function (lng, lat) {
    var self = this;
    self.measurePoints.push([lng, lat]);

    var features = [];
    for (var i = 0; i < self.measurePoints.length; i++) {
      features.push({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: self.measurePoints[i] },
        properties: {}
      });
    }

    var geojson = { type: 'FeatureCollection', features: features };

    if (self.measureType === 'area' && self.measurePoints.length >= 3) {
      /* Close the polygon for area display */
      var polygonCoords = self.measurePoints.slice();
      polygonCoords.push(self.measurePoints[0]);

      features.push({
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: polygonCoords },
        properties: {}
      });
    } else if (self.measurePoints.length >= 2) {
      features.push({
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: self.measurePoints },
        properties: {}
      });
    }

    try {
      self.map.getSource('measure-points-src').setData(geojson);
    } catch (e) { /* ignore */ }

    /* Calculate and show measurement */
    if (!turf) return;

    if (self.measureType === 'distance' && self.measurePoints.length >= 2) {
      var totalDist = 0;
      for (var d = 1; d < self.measurePoints.length; d++) {
        var from = turf.point(self.measurePoints[d - 1]);
        var to = turf.point(self.measurePoints[d]);
        totalDist += turf.distance(from, to, { units: 'meters' });
      }

      var distText = '';
      if (totalDist >= 1000) {
        distText = (totalDist / 1000).toFixed(2) + ' \u0995\u09BF.\u09AE\u09BF.';
      } else {
        distText = totalDist.toFixed(1) + ' \u09AE\u09BF\u099F\u09BE\u09B0';
      }

      self._showMeasureLabel(self.measurePoints[self.measurePoints.length - 1],
        '\u09A6\u09C2\u09B0\u09A4\u09CD\u09AC: ' + distText);

    } else if (self.measureType === 'area' && self.measurePoints.length >= 3) {
      var polygonCoords = self.measurePoints.slice();
      polygonCoords.push(self.measurePoints[0]);
      var poly = turf.polygon([polygonCoords]);
      var areaSqM = turf.area(poly);

      var areaText = '';
      if (areaSqM > 4046.8564224) {
        areaText = (areaSqM / 4046.8564224).toFixed(2) + ' \u098F\u0995\u09B0';
      } else {
        areaText = areaSqM.toFixed(1) + ' \u09AC\u09B0\u09CD\u0997\u09AE\u09BF\u099F\u09BE\u09B0';
      }

      var center = turf.centerOfMass(poly);
      self._showMeasureLabel(center.geometry.coordinates,
        '\u0995\u09CD\u09B7\u09C7\u09A4\u09CD\u09B0\u09AB\u09B2: ' + areaText);
    }
  };

  /* ----- _showMeasureLabel (internal) ----- */
  PlantationGIS.prototype._showMeasureLabel = function (coordinates, text) {
    var self = this;

    if (self.measurePopup) {
      self.measurePopup.remove();
    }

    var popupEl = document.createElement('div');
    popupEl.style.cssText = 'background:#1e40af;color:#ffffff;padding:4px 10px;border-radius:6px;' +
      'font-size:12px;font-weight:600;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.3);';
    popupEl.textContent = text;

    self.measurePopup = new maplibregl.Popup({
      offset: 12,
      closeButton: false,
      closeOnClick: false,
      className: 'measure-popup'
    })
      .setLngLat(coordinates)
      .setDOMContent(popupEl)
      .addTo(self.map);
  };

  /* ----- _showMeasureNotification (internal) ----- */
  PlantationGIS.prototype._showMeasureNotification = function (text) {
    var self = this;
    var mapEl = self.map.getContainer();

    /* Remove existing notification */
    var existing = mapEl.querySelector('.gis-measure-notify');
    if (existing) existing.remove();

    var notif = document.createElement('div');
    notif.className = 'gis-measure-notify';
    notif.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);' +
      'z-index:999;background:rgba(30,64,175,0.9);color:#fff;padding:12px 20px;border-radius:10px;' +
      'font-size:14px;font-family:system-ui,Tahoma,sans-serif;pointer-events:none;' +
      'box-shadow:0 4px 16px rgba(0,0,0,0.3);text-align:center;max-width:350px;';
    notif.textContent = text;

    mapEl.appendChild(notif);

    setTimeout(function () {
      if (notif.parentNode) notif.remove();
    }, 3000);
  };

  /* ----- clearMeasurement ----- */
  PlantationGIS.prototype.clearMeasurement = function () {
    var self = this;
    self.measuring = false;
    self.measureType = null;
    self.measurePoints = [];

    if (self.map) {
      self.map.getCanvas().style.cursor = '';

      try {
        if (self.map.getSource('measure-points-src')) {
          self.map.getSource('measure-points-src').setData({ type: 'FeatureCollection', features: [] });
        }
        if (self.map.getLayer('measure-points-layer')) {
          self.map.setLayoutProperty('measure-points-layer', 'visibility', 'none');
        }
        if (self.map.getLayer('measure-line-layer')) {
          self.map.setLayoutProperty('measure-line-layer', 'visibility', 'none');
        }
      } catch (e) { /* ignore */ }
    }

    if (self.measurePopup) {
      self.measurePopup.remove();
      self.measurePopup = null;
    }

    var existing = self.map.getContainer().querySelector('.gis-measure-notify');
    if (existing) existing.remove();
  };

  /* ----- fitToEntries ----- */
  PlantationGIS.prototype.fitToEntries = function (entries) {
    var self = this;
    if (!self.map || !entries || entries.length === 0) return;

    var bounds = new maplibregl.LngLatBounds();
    var count = 0;

    for (var i = 0; i < entries.length; i++) {
      var s = entries[i];
      if (!s.geoLocation) continue;
      var parts = s.geoLocation.split(',');
      var lat = parseFloat(parts[0]);
      var lng = parseFloat(parts[1]);
      if (isNaN(lat) || isNaN(lng)) continue;

      bounds.extend([lng, lat]);
      count++;
    }

    if (count > 0) {
      self.map.fitBounds(bounds, { padding: { top: 50, bottom: 50, left: 50, right: 250 }, maxZoom: 14 });
    } else {
      /* Default Bangladesh bounds */
      self.map.fitBounds([[88.0, 20.5], [92.7, 26.6]], { padding: 20 });
    }
  };

  /* ----- zoomToMyLocation ----- */
  PlantationGIS.prototype.zoomToMyLocation = function () {
    var self = this;
    if (!self.map || !self._supported) return;

    if (!navigator.geolocation) {
      alert('\u0986\u09AA\u09A8\u09BE\u09B0 \u09AC\u09CD\u09B0\u09BE\u0989\u099C\u09BE\u09B0 \u0985\u09AC\u09B8\u09CD\u09A5\u09BE\u09A8 \u09B8\u09C7\u09AC\u09BE \u0995\u09B0\u09C7 \u09A8\u09BE\u0964');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      function (position) {
        var lng = position.coords.longitude;
        var lat = position.coords.latitude;

        /* Remove previous marker */
        if (self.myLocationMarker) {
          self.myLocationMarker.remove();
        }

        /* Create pulsing dot marker */
        var el = document.createElement('div');
        el.style.cssText = 'width:20px;height:20px;border-radius:50%;' +
          'background:rgba(59,130,246,0.4);border:3px solid #3B82F6;' +
          'animation:gis-pulse 2s ease-in-out infinite;box-shadow:0 0 12px rgba(59,130,246,0.6);';

        /* Add keyframes if not already present */
        if (!document.getElementById('gis-pulse-style')) {
          var style = document.createElement('style');
          style.id = 'gis-pulse-style';
          style.textContent = '@keyframes gis-pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.4); opacity: 0.6; } 100% { transform: scale(1); opacity: 1; } }';
          document.head.appendChild(style);
        }

        self.myLocationMarker = new maplibregl.Marker({ element: el })
          .setLngLat([lng, lat])
          .addTo(self.map);

        self.map.flyTo({ center: [lng, lat], zoom: 15, speed: 1.5 });
      },
      function (error) {
        console.warn('[GIS] Geolocation error:', error.message);
        alert('\u0985\u09AC\u09B8\u09CD\u09A5\u09BE\u09A8 \u09AA\u09C7\u09A4\u09C7 \u09B8\u09AE\u09B8\u09CD\u09AF\u09BE \u09B9\u09DF\u09A8\u09BF: ' + error.message);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  /* ----- refreshMarkers ----- */
  PlantationGIS.prototype.refreshMarkers = function () {
    var self = this;
    if (!self.map || !self._supported) return;

    try {
      /* Apply filters if filter selects exist */
      var regionFilter = document.getElementById('mapRegion');
      var districtFilter = document.getElementById('mapDistrict');
      var upazilaFilter = document.getElementById('mapUpazila');

      var filtered;
      if (typeof getMapEntries === 'function') {
        filtered = getMapEntries();
      } else if (typeof getSubmissions === 'function') {
        filtered = getSubmissions();
      } else {
        filtered = [];
      }

      if (regionFilter && regionFilter.value) {
        filtered = filtered.filter(function (e) { return e.region === regionFilter.value; });
      }
      if (districtFilter && districtFilter.value) {
        filtered = filtered.filter(function (e) { return e.district === districtFilter.value; });
      }
      if (upazilaFilter && upazilaFilter.value) {
        filtered = filtered.filter(function (e) { return e.upazila === upazilaFilter.value; });
      }

      self.addPlantationMarkers(filtered);

      /* Update sync status */
      var syncStatus = document.getElementById('mapSyncStatus');
      if (syncStatus) {
        syncStatus.textContent = '\u09AE\u09BE\u09AA \u0986\u09AA\u09A1\u09C7\u099F \u09B9\u09DF\u09C7\u099B\u09C7';
        syncStatus.style.color = '#16a34a';
      }

      /* Update refresh button */
      var refreshBtn = document.getElementById('mapRefreshBtn');
      if (refreshBtn) {
        refreshBtn.disabled = false;
        refreshBtn.textContent = '\u09B0\u09BF\u09AB\u09CD\u09B0\u09C7\u09B6';
      }

      /* Update upazila legend */
      self._updateUpazilaLegend(filtered);

    } catch (err) {
      console.error('[GIS] refreshMarkers error:', err);
    }
  };

  /* ----- _updateUpazilaLegend (internal) ----- */
  PlantationGIS.prototype._updateUpazilaLegend = function (entries) {
    var legendEl = document.getElementById('mapUpazilaLegend');
    if (!legendEl || typeof upazilaColor !== 'function') return;

    var upazilas = {};
    for (var i = 0; i < entries.length; i++) {
      var u = entries[i].upazila;
      if (u) {
        if (!upazilas[u]) upazilas[u] = 0;
        upazilas[u]++;
      }
    }

    var html = '<div style="display:flex;flex-wrap:wrap;gap:4px;padding:4px 0;">';
    var keys = Object.keys(upazilas).sort();
    for (var j = 0; j < keys.length; j++) {
      var upz = keys[j];
      var color = upazilaColor(upz);
      html += '<div style="display:flex;align-items:center;gap:3px;background:#f9fafb;border-radius:4px;' +
        'padding:2px 6px;font-size:11px;border:1px solid #e5e7eb;">' +
        '<span style="width:10px;height:10px;border-radius:50%;background:' + color +
        ';display:inline-block;flex-shrink:0;"></span>' +
        '<span>' + upz + ' (' + upazilas[upz] + ')</span></div>';
    }
    html += '</div>';

    legendEl.innerHTML = html;
  };

  /* ----- update ----- */
  PlantationGIS.prototype.update = function () {
    var self = this;
    if (!self._supported) return;
    self.refreshMarkers();
    self.loadStoredGeometries();
  };

  /* ----- destroy ----- */
  PlantationGIS.prototype.destroy = function () {
    var self = this;

    if (self.measurePopup) {
      self.measurePopup.remove();
      self.measurePopup = null;
    }

    if (self.myLocationMarker) {
      self.myLocationMarker.remove();
      self.myLocationMarker = null;
    }

    self.clearMeasurement();

    if (self.map) {
      self.map.remove();
      self.map = null;
    }

    /* Remove control panel if present */
    if (self._controlPanel && self._controlPanel.parentNode) {
      self._controlPanel.parentNode.removeChild(self._controlPanel);
    }
    if (self._drawSection) {
      self._drawSection = null;
    }

    /* Remove pulse style */
    var pulseStyle = document.getElementById('gis-pulse-style');
    if (pulseStyle) pulseStyle.remove();

    /* Remove toggle button */
    var toggleBtn = document.getElementById('gis-control-toggle');
    if (toggleBtn) toggleBtn.remove();

    self.basemaps = [];
    self.layerDefs = [];
    self.boundaryPolygons = [];
    self.boundaryIndex = { division: [], district: [], upazila: [], union: [] };
    self._supported = false;
  };


  /* ===========================================================
   * Section 4: Admin Boundary Loading
   * ===========================================================
   * /gis/boundaries/ ডিরেক্টরি থেকে GeoJSON ফাইল লোড করে।
   * ফাইল না থাকলে নীরবে স্কিপ করে।
   * =========================================================== */

  function loadBangladeshBoundaries(gisInstance) {
    if (!gisInstance || !gisInstance.map) return;

    var levels = [
      { key: 'division', file: '/gis/boundaries/divisions.geojson' },
      { key: 'district', file: '/gis/boundaries/districts.geojson' },
      { key: 'upazila', file: '/gis/boundaries/upazilas.geojson' },
      { key: 'union', file: '/gis/boundaries/unions.geojson' }
    ];

    levels.forEach(function (level) {
      fetch(level.file)
        .then(function (response) {
          if (!response.ok) {
            throw new Error('HTTP ' + response.status);
          }
          return response.json();
        })
        .then(function (geojson) {
          if (geojson && geojson.features && geojson.features.length > 0) {
            gisInstance.addAdminBoundaries(geojson, level.key);
          }
        })
        .catch(function () {
          /* Silently skip — boundary files are optional */
        });
    });
  }


  /* ===========================================================
   * Section 3: Global Initialization
   * ===========================================================
   * গ্লোবাল ভেরিয়েবল এবং ফাংশন যা HTML পেজ থেকে কল হবে।
   * =========================================================== */

  var gisMap = null;

  window.initGIS = function () {
    var container = document.getElementById('leafletMap');
    if (!container) {
      console.warn('[GIS] \u09AE\u09BE\u09AA \u0995\u09A8\u099F\u09C7\u0987\u09A8\u09BE\u09B0 \u09AA\u09BE\u0993\u09AF\u09BC\u09BE \u09AF\u09BE\u09AF\u09BC \u09A8\u09BF (#leafletMap)\u0964');
      return;
    }
    if (gisMap) {
      gisMap.destroy();
    }
    gisMap = new PlantationGIS('leafletMap');
    window.gisMap = gisMap;
  };

  /* Override existing renderMap to use GIS module */
  window.renderMap = function () {
    if (!gisMap) {
      window.initGIS();
    }
    if (!gisMap || !gisMap._supported) return;

    /* Fetch national data FIRST, then render markers */
    if (typeof fetchNationalEntries === 'function') {
      fetchNationalEntries(false).then(function () {
        gisMap.refreshMarkers();
      });
    } else {
      gisMap.refreshMarkers();
    }
  };

  /* Override zoomToMyGeoLocation */
  window.zoomToMyGeoLocation = function () {
    if (!gisMap) {
      window.initGIS();
    }
    if (gisMap && gisMap._supported) {
      gisMap.zoomToMyLocation();
    }
  };

  /* Expose for drawing tools from form */
  window.getGISMap = function () {
    return gisMap;
  };

})();