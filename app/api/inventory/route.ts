import { NextRequest, NextResponse } from 'next/server';
import { products } from '@/data/products';
import { STATUSES, type InventoryEntry, type InventoryStatus } from '@/lib/inventory';
import { upstashCreds, upstashPipeline } from '@/lib/store';

/**
 * In-store inventory state for the staff tablet dashboard (PRD Phase 5).
 * GET is open (sample-catalog demo data); mutations require STAFF_TOKEN.
 */

const memoryInventory = new Map<string, InventoryEntry>();

function staffToken(): string | null {
  return process.env.STAFF_TOKEN ?? null;
}

function authorized(req: NextRequest): boolean {
  const token = staffToken();
  if (!token) return false;
  return req.headers.get('x-staff-token') === token;
}

async function readAll(): Promise<{ overrides: Record<string, InventoryEntry>; mode: 'upstash' | 'memory' }> {
  if (!upstashCreds()) {
    return { overrides: Object.fromEntries(memoryInventory), mode: 'memory' };
  }
  try {
    const json = (await upstashPipeline([['HGETALL', 'rf:inventory']])) as {
      result: Record<string, string> | string[] | null;
    };
    const raw = json.result;
    const overrides: Record<string, InventoryEntry> = {};
    if (raw && !Array.isArray(raw)) {
      for (const [k, v] of Object.entries(raw)) {
        try {
          const entry = JSON.parse(v) as InventoryEntry;
          if (STATUSES.includes(entry.status)) overrides[k] = entry;
        } catch {
          /* skip corrupt entries */
        }
      }
    } else if (Array.isArray(raw)) {
      for (let i = 0; i + 1 < raw.length; i += 2) {
        try {
          const entry = JSON.parse(raw[i + 1] as string) as InventoryEntry;
          if (STATUSES.includes(entry.status)) overrides[raw[i] as string] = entry;
        } catch {
          /* skip corrupt entries */
        }
      }
    }
    return { overrides, mode: 'upstash' };
  } catch {
    return { overrides: Object.fromEntries(memoryInventory), mode: 'memory' };
  }
}

export async function GET() {
  const { overrides, mode } = await readAll();
  return NextResponse.json({ ok: true, mode, overrides });
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) {
    return new NextResponse(null, { status: 404 });
  }

  let body: { productId?: unknown; status?: unknown };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const product = products.find((p) => p.id === body.productId);
  if (!product) {
    return NextResponse.json({ ok: false, error: 'unknown_product' }, { status: 400 });
  }
  if (!STATUSES.includes(body.status as InventoryStatus)) {
    return NextResponse.json({ ok: false, error: 'unknown_status' }, { status: 400 });
  }

  const entry: InventoryEntry = { status: body.status as InventoryStatus, updatedAt: new Date().toISOString() };

  let mode: 'upstash' | 'memory' = 'memory';
  try {
    if (!upstashCreds()) {
      memoryInventory.set(product.id, entry);
    } else {
      await upstashPipeline([['HSET', 'rf:inventory', product.id, JSON.stringify(entry)]]);
      mode = 'upstash';
    }
  } catch {
    memoryInventory.set(product.id, entry);
  }

  return NextResponse.json({ ok: true, productId: product.id, entry, mode });
}
