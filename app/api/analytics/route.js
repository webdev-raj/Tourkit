import { NextResponse } from 'next/server'

import { createAdminClient } from '@/lib/supabase/admin'

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() })
}

export async function POST(req) {
  try {
    let script_key = ''
    let event_type = ''
    let step_order = null
    let session_id = null
    try {
      ;({ script_key, event_type, step_order, session_id } = await req.json())
    } catch {
      /* fail silently */
    }

    const scriptKey = typeof script_key === 'string' ? script_key.trim() : ''
    const eventType = typeof event_type === 'string' ? event_type.trim() : ''
    const rawOrder = step_order
    const sessionId = typeof session_id === 'string' && session_id.trim() ? session_id.trim() : null
    const stepOrder =
      rawOrder === null || rawOrder === undefined || rawOrder === ''
        ? null
        : Number.isFinite(Number(rawOrder))
          ? Number(rawOrder)
          : null

    if (scriptKey && eventType) {
      try {
        const supabase = createAdminClient()
        const { data: project } = await supabase
          .from('projects')
          .select('id')
          .eq('script_key', scriptKey)
          .maybeSingle()

        if (project?.id) {
          await supabase.from('analytics_events').insert({
            project_id: project.id,
            event_type: eventType,
            step_order: stepOrder,
            session_id: sessionId,
          })
        }
      } catch {
        /* fail silently */
      }
    }
  } catch {
    /* fail silently */
  }

  return NextResponse.json({ ok: true }, { status: 200, headers: corsHeaders() })
}
