import { SignUp } from '@clerk/clerk-react'
import './signUpPage.css'

const SignUpPage = () => {
  return (
    <div className='signUpPage'>
      <SignUp 
        routing='path'
        path='/sign-up'
        signInUrl='/sign-in'
        forceRedirectUrl='/start-chat'
        fallbackRedirectUrl="/start-chat"
      />
    </div>
  )
}

export default SignUpPage
