import SolutionDetailPage, { generateMetadata as baseMetadata } from '../giai-phap/[slug]/page'

export async function generateMetadata() {
  return baseMetadata({ params: Promise.resolve({ slug: 'giai-phap-mang' }) })
}

export default async function Page() {
  return <SolutionDetailPage params={Promise.resolve({ slug: 'giai-phap-mang' })} />
}
