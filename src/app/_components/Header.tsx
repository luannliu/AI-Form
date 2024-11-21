'use client'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useEffect } from 'react'
import { SignInButton, UserButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

function header() {
    const { isSignedIn } = useUser()
    const path = usePathname()
    return !path.includes('formView')&&(
        <div className='p-5 border shadow-sm'>
            <div className='flex items-center justify-between'>
                <Image src={'/logo.svg'} alt="logo" width={180} height={50} />
                <div>
                    {isSignedIn ?
                        <div className='flex items-center gap-5'>
                            <Link href={'/dashboard'} >
                                <Button variant='outline'>Dashboard</Button>
                            </Link>

                            <UserButton />
                        </div> :
                        <SignInButton>
                            <Button >Get Started</Button>
                        </SignInButton>
                    }
                </div>
            </div>
        </div>
    )
}

export default header