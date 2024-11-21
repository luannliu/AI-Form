import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'


//除了被保护外的所有页面都不需要登录
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)'])

export default clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) {
        await auth.protect()
    }
})

//除公共页外的所有页面都需要登录
// const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)'])

// export default clerkMiddleware(async (auth, request) => {
//   if (!isPublicRoute(request)) {
//     await auth.protect()
//   }
// })

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}