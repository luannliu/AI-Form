'use client'
import { SignedIn } from '@clerk/nextjs';
import SiderBar from './_components/siderBar';
import React from 'react'

function DashboardLayout({ children }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SignedIn >
            <div>
                <div className='w-64 fixed '>
                    <SiderBar />
                </div>
                <div className='ml-64'>
                    {children}
                </div>
            </div>
        </SignedIn>
    )
}

export default DashboardLayout