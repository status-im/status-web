import HomePage, {
  generateMetadata,
} from '../../../../../status.app/src/app/(website)/page'

export const dynamic =
  process.env.NODE_ENV === 'development' ? 'force-dynamic' : 'force-static'

export default HomePage
export { generateMetadata }
