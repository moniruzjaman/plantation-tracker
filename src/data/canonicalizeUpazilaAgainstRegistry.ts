/**
 * Reconciles a "wild" upazila string against a set of known-good upazila
 * names (typically Object.keys(mergedPolygons) from useDistrictPolygons)
 * -- unlike plantation-tracker-app's canonicalizeUpazila.ts, this one
 * takes the target list as a parameter rather than a fixed Kurigram-only
 * constant, since this repo's registry is dynamic (whichever districts
 * are currently loaded).
 *
 * WHY THIS EXISTS: entries displayed here can originate from two very
 * different write paths -- plantation.html's own dropdown-constrained
 * form (mostly reliable, but its own auto-select can still fail on a
 * Unicode-normalization mismatch and leave the field unset), and
 * plantation-tracker-app's submission wizard, which stores whatever
 * Nominatim's reverse-geocode returned essentially unvalidated before a
 * canonicalizeUpazila fix landed there. Either way, this repo's map only
 * ever *reads* that data -- it can't fix it at the source, so every
 * upazila-keyed lookup here (geofence polygon check, filter, color) needs
 * to tolerate spelling drift on the read side.
 */

const collapse = (s: string) =>
  s
    .normalize('NFC')
    .replace(/ী/g, 'ি')
    .replace(/ৌ/g, 'ো')
    .replace(/ূ/g, 'ু')
    .replace(/\s+/g, '')
    .trim();

/**
 * Returns the matching key from `knownUpazilas` for `raw`, or `raw`
 * itself (NFC-normalized) if nothing matches confidently. Never guesses
 * wrong -- an unmatched value just won't benefit from canonicalization,
 * same graceful-degradation behavior as the rest of this app's geofence
 * checks for unrecognized upazila names.
 */
export function canonicalizeUpazilaAgainstRegistry(raw: string | undefined | null, knownUpazilas: string[]): string {
  if (!raw) return raw ?? '';
  const input = raw.normalize('NFC').trim();
  if (!input) return input;
  if (knownUpazilas.includes(input)) return input;

  const inputCollapsed = collapse(input);
  const variantMatch = knownUpazilas.find((u) => collapse(u) === inputCollapsed);
  if (variantMatch) return variantMatch;

  const containment = knownUpazilas.find((u) => {
    const uc = collapse(u);
    return inputCollapsed.includes(uc) || uc.includes(inputCollapsed);
  });
  if (containment) return containment;

  return input;
}
