import './signInPage.css'
import { SignIn } from '@clerk/clerk-react'

const SignInPage = () => {
  return (
    <div className='signInPage'>
        <SignIn 
        // path="/sign-in" signUpUrl='/sign-up' forceRedirectUrl='/start-chat'
        routing='path'
        path='/sign-in'
        signUpUrl='/sign-up'
        forceRedirectUrl='/start-chat'
        fallbackRedirectUrl="/start-chat"
        />
    </div>
  )
}

export default SignInPage;
