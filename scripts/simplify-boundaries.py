#!/usr/bin/env python3
"""Simplify Bangladesh boundary GeoJSON files for web use."""
import json, sys, os

BASE = os.path.join(os.path.dirname(__file__), '..', 'public', 'gis', 'boundaries')

def simplify_coords(coords, tolerance):
    """Ramer-Douglas-Peucker simplification (recursive)."""
    if len(coords) <= 2:
        return coords
    # Find point with max distance from line between first and last
    dx = coords[-1][0] - coords[0][0]
    dy = coords[-1][1] - coords[0][1]
    line_len_sq = dx*dx + dy*dy
    if line_len_sq == 0:
        max_dist = max(abs(c[1] - coords[0][1]) for c in coords)
        max_idx = max(range(len(coords)), key=lambda i: abs(coords[i][1] - coords[0][1]))
    else:
        max_dist = 0
        max_idx = 0
        for i in range(1, len(coords)-1):
            dist = abs(dy*coords[i][0] - dx*coords[i][1] + coords[-1][0]*coords[0][1] - coords[-1][1]*coords[0][0]) / line_len_sq**0.5
            if dist > max_dist:
                max_dist = dist
                max_idx = i
    if max_dist > tolerance:
        left = simplify_coords(coords[:max_idx+1], tolerance)
        right = simplify_coords(coords[max_idx:], tolerance)
        return left[:-1] + right
    else:
        return [coords[0], coords[-1]]

def simplify_ring(ring, tol):
    return simplify_coords(ring, tol)

def simplify_polygon(polygon, tol):
    return [simplify_ring(ring, tol) for ring in polygon]

def simplify_geom(geom, tol):
    if geom['type'] == 'Polygon':
        return {**geom, 'coordinates': simplify_polygon(geom['coordinates'], tol)}
    elif geom['type'] == 'MultiPolygon':
        return {**geom, 'coordinates': [simplify_polygon(p, tol) for p in geom['coordinates']]}
    return geom

def process(filename, tolerance, keep_props=None):
    filepath = os.path.join(BASE, filename)
    if not os.path.exists(filepath):
        print(f"  SKIP {filename} (not found)")
        return
    
    with open(filepath, 'r') as f:
        data = json.load(f)
    
    before_size = os.path.getsize(filepath)
    feat_count = len(data['features'])
    
    # Strip properties to only keep what we need
    for feat in data['features']:
        p = feat['properties']
        keep = {}
        if keep_props:
            for k in keep_props:
                if k in p:
                    keep[k] = p[k]
        feat['properties'] = keep
        # Simplify geometry
        if tolerance > 0:
            feat['geometry'] = simplify_geom(feat['geometry'], tolerance)
    
    # Remove metadata keys that aren't standard GeoJSON
    for k in list(data.keys()):
        if k.startswith('_'):
            del data[k]
    
    out = json.dumps(data, separators=(',', ':'))
    after_size = len(out.encode('utf-8'))
    reduction = ((before_size - after_size) / before_size * 100)
    
    with open(filepath, 'w') as f:
        f.write(out)
    
    print(f"  {filename}: {feat_count} features, {before_size/1024/1024:.1f} MB -> {after_size/1024:.1f} KB ({reduction:.1f}% smaller)")

print("Simplifying Bangladesh boundaries...")
print()
process('divisions.geojson', 0.0001, ['shapeName', 'shapeISO', 'shapeGroup'])
process('districts.geojson', 0.0004, ['shapeName', 'shapeISO', 'shapeGroup'])
process('upazilas.geojson', 0.0008, ['shapeName', 'shapeISO', 'shapeGroup'])
print()
print("Done!")