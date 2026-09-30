import ServiceDetailPage, { generateMetadata as baseMetadata } from '../dich-vu/[slug]/page'

export async function generateMetadata() {
  return baseMetadata({ params: Promise.resolve({ slug: 'dich-vu-tu-van' }) })
}

export default async function Page() {
  return <ServiceDetailPage params={Promise.resolve({ slug: 'dich-vu-tu-van' })} />
}
