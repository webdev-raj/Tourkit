import { createProject } from '@/app/actions/projects'
import { ProjectCreateForm } from '@/components/dashboard/project-create-form'
import { ProjectsCards, EmptyProjectsState } from '@/components/dashboard/projects-cards'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Projects — TourKit',
}

export const dynamic = 'force-dynamic'

export default async function DashboardProjectsPage() {
  const supabase = await createClient()

  const { data: projects, error } = await supabase
    .from('projects')
    .select('id, name, domain, script_key, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <div className="space-y-3 rounded-xl border border-white/10 bg-card/20 px-4 py-5 sm:px-6">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Projects</h1>
          <p className="text-sm text-muted-foreground">Something went wrong loading your workspace.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,22rem)] lg:items-start">
          <Card className="min-w-0 rounded-xl border border-white/10 bg-card/20">
            <CardHeader>
              <CardTitle>Couldn’t load projects</CardTitle>
              <CardDescription>{error.message}</CardDescription>
            </CardHeader>
          </Card>
          <aside className="min-w-0 lg:sticky lg:top-20 lg:self-start">
            <ProjectCreateForm action={createProject} />
          </aside>
        </div>
      </div>
    )
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const projectIds = (projects ?? []).map((p) => p.id)

  const { data: tours } = projectIds.length
    ? await supabase
        .from('tours')
        .select('id, project_id, is_active, created_at')
        .in('project_id', projectIds)
    : { data: [] }

  const toursSafe = tours ?? []

  const tourIdsForStepCounts = []
  const selectedTourByProjectId = {}

  for (const p of projects ?? []) {
    const projectTours = toursSafe
      .filter((t) => t.project_id === p.id)
      .sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))

    const activeTour = projectTours.find((t) => t.is_active) ?? projectTours[0] ?? null
    selectedTourByProjectId[p.id] = activeTour

    if (activeTour?.id) tourIdsForStepCounts.push(activeTour.id)
  }

  const uniqueTourIds = Array.from(new Set(tourIdsForStepCounts))

  const { data: steps } = uniqueTourIds.length
    ? await supabase.from('steps').select('tour_id').in('tour_id', uniqueTourIds)
    : { data: [] }

  const stepsByTourId = {}
  ;(steps ?? []).forEach((s) => {
    const key = s.tour_id
    stepsByTourId[key] = (stepsByTourId[key] ?? 0) + 1
  })

  const enhancedProjects = (projects ?? []).map((p) => {
    const tour = selectedTourByProjectId[p.id]
    return {
      ...p,
      tour_is_active: Boolean(tour?.is_active),
      steps_count: tour?.id ? stepsByTourId[tour.id] ?? 0 : 0,
    }
  })

  const totalProjects = enhancedProjects.length
  const totalActiveTours = toursSafe.filter((t) => t.is_active).length

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-white/10 bg-card/20 px-4 py-5 sm:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Projects</h1>
            <p className="max-w-xl text-sm text-muted-foreground">
              Manage your websites and onboarding tours.
            </p>
          </div>

          <div className="grid w-full max-w-md grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/10 bg-background/20 p-4">
              <div className="text-xs font-medium text-muted-foreground">Total projects</div>
              <div className="mt-1 text-xl font-semibold text-foreground">{totalProjects}</div>
            </div>

            <div className="rounded-xl border border-white/10 bg-background/20 p-4">
              <div className="text-xs font-medium text-muted-foreground">Active tours</div>
              <div className="mt-1 text-xl font-semibold text-foreground">{totalActiveTours}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,22rem)] lg:items-start">
        <div className="min-w-0">
          {enhancedProjects.length ? (
            <ProjectsCards projects={enhancedProjects} appUrl={appUrl} />
          ) : (
            <EmptyProjectsState />
          )}
        </div>

        <aside id="create-project-form" className="min-w-0 lg:sticky lg:top-20 lg:self-start">
          <ProjectCreateForm action={createProject} />
        </aside>
      </div>
    </div>
  )
}

