'use client'

import ResendConfirmationButton from '@/components/subscriber/ResendConfirmationButton'
import { createValidateEmailLink } from '@/lib/utils'
import { redirect } from 'next/navigation'
import { createPreferencesLink } from '@/lib/utils'
import { getOneSubscriberByToken } from '@/lib/queries'
import VerifiedStatus from '@/components/subscriber/VerifiedStatus'
import { useState, useEffect } from 'react'

interface ConfirmEmailProps {
  searchParams: {
    token: string | undefined
  }
}

//TODO: Add polling cycling to check email verification status
// eslint-disable-next-line @next/next/no-async-client-component
export default async function ConfirmEmail({
  searchParams,
}: ConfirmEmailProps) {
  const tokenFromParams: any = searchParams.token
  const [email, setEmail] = useState('');
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const fetchSubscriber = async () => {
      if (!tokenFromParams) {
        return redirect('/');
      }
      const subscriber = await getOneSubscriberByToken(tokenFromParams);
      if (!subscriber || !subscriber.email) {
        return redirect('/');
      }
      setEmail(subscriber.email);
      setVerified(subscriber.verified);
    };

    // Fetch subscriber details initially
    fetchSubscriber();

    // Polling cycle to check email verification status every 5 seconds
    const intervalId = setInterval(fetchSubscriber, 5000);

    return () => clearInterval(intervalId);
  }, [tokenFromParams]);

  
  if (verified) {
    const preferencesLink = createPreferencesLink(tokenFromParams)
    return redirect(preferencesLink)
  }

  const validateEmailLink = createValidateEmailLink(tokenFromParams)

  return (
    <main className="mx-4 -mt-12 flex max-w-[1000px] flex-col items-center rounded-xl border border-white bg-[#0C111C] p-8 text-white shadow-xl md:mx-auto  md:-mt-24 md:mb-10">
      {/* email and verified status */}
      <VerifiedStatus email={email} verified={verified as boolean} />

      {/* call to action */}
      <h1 className="my-4 text-2xl font-semibold tracking-tight md:mb-16 md:mt-10 md:text-7xl">
        Please Verify Your Email!
      </h1>
      <p className=" mb-10 text-center text-xs leading-6 md:mb-20 md:text-2xl md:leading-10">
        {` You'll receive an email shortly at `}
        <span className="font-bold text-teal-500 underline">{email}</span>.
        <br />
        Click the link in your email to verify your account.
      </p>

      <ResendConfirmationButton
        email={email}
        validateEmailLink={validateEmailLink}
      />
    </main>
  )
}
