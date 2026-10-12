import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSolutionById } from '@/lib/dal/solutions'
import { SolutionForm } from '../_components/SolutionForm'
import { updateSolutionAction } from '../actions'

interface EditSolutionPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: EditSolutionPageProps): Promise<Metadata> {
  const { id } = await params
  const solution = await getSolutionById(id)
  return {
    title: solution ? `Chỉnh sửa: ${solution.name} | Admin GTS` : 'Chỉnh sửa Giải pháp | Admin GTS',
  }
}

export default async function EditSolutionPage({ params }: EditSolutionPageProps) {
  const { id } = await params
  const solution = await getSolutionById(id)

  if (!solution) {
    notFound()
  }

  const boundAction = updateSolutionAction.bind(null, id)

  return <SolutionForm initialData={solution} action={boundAction} />
}
