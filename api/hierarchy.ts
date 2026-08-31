/**
 * GET /api/admin/hierarchy
 * GET /api/admin/hierarchy?district=ঢাকা
 * GET /api/admin/hierarchy?district=ঢাকা&upazila=ধামরাই
 *
 * Returns the administrative hierarchy data for dropdowns and validation.
 * Uses static data (no DB required) — always available, even offline.
 *
 * When Prisma + Neon is connected, this can optionally fall through to
 * the database for real-time data (e.g., custom upazilas added by users).
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  getDistrictOptions,
  getUpazilaOptionsForDistrict,
  getUnionOptionsForUpazila,
  getDivisionOptions,
  getDistrictStats,
  isValidDistrict,
  isValidUpazila,
  isUpazilaInDistrict,
  getDistrictId,
  getUpazilaId,
  resolveDivisionFromDistrict,
} from '../src/data/adminHierarchyLoader';
import {
  UPAZILAS,
  UNIONS_BY_UPAZILA,
  getDivisionForDistrict,
} from '../src/data/adminHierarchy';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { district, upazila, stats, validate } = req.query;

  try {
    // ─── Stats mode ───
    if (stats === '1') {
      return res.status(200).json({ ok: true, stats: getDistrictStats() });
    }

    // ─── Validation mode ───
    if (validate && district) {
      const d = String(district);
      const u = upazila ? String(upazila) : undefined;
      const result: Record<string, unknown> = {
        district: d,
        districtValid: isValidDistrict(d),
        districtId: getDistrictId(d),
        division: resolveDivisionFromDistrict(d),
      };
      if (u) {
        result.upazila = u;
        result.upazilaValid = isValidUpazila(u);
        result.upazilaInDistrict = isUpazilaInDistrict(u, d);
        result.upazilaId = getUpazilaId(u);
      }
      return res.status(200).json({ ok: true, validation: result });
    }

    // ─── Cascading dropdown mode ───
    if (district && upazila) {
      // District + Upazila → Unions
      const unions = getUnionOptionsForUpazila(String(upazila));
      return res.status(200).json({
        ok: true,
        district: String(district),
        upazila: String(upazila),
        unions,
      });
    }

    if (district) {
      // District → Upazilas
      const upazilas = getUpazilaOptionsForDistrict(String(district));
      const div = getDivisionForDistrict(String(district));
      return res.status(200).json({
        ok: true,
        district: String(district),
        division: div ? { nameBn: div.nameBn, nameEn: div.nameEn } : null,
        upazilas,
      });
    }

    // ─── Full hierarchy (paginated-friendly) ───
    return res.status(200).json({
      ok: true,
      divisions: getDivisionOptions(),
      districts: getDistrictOptions(),
      meta: {
        divisionCount: 8,
        districtCount: 64,
        upazilaCount: UPAZILAS.length,
        unionCount: Object.values(UNIONS_BY_UPAZILA).reduce((s, u) => s + u.length, 0),
      },
    });
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}
