import type { Metadata } from 'next'
import { SolutionForm } from '../_components/SolutionForm'
import { createSolutionAction } from '../actions'

export const metadata: Metadata = {
  title: 'Thêm Giải Pháp Mới | Admin GTS',
}

export default function NewSolutionPage() {
  return <SolutionForm action={createSolutionAction} />
}
