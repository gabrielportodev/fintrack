import { redirect } from 'next/navigation'

const RootPage = () => {
  redirect('/auth/sign-in')
}

export default RootPage
