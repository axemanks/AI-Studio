This is AI-Studio - A SaaS platform that has many tools that can be used on a credit system
Credits can be purchased to continue using the tools.


Todos:
add grid background to chat
add copy function to chats


Next JS 13.4.10: npx create-next-app@latest my-app --typescript --tailwind --eslint
Uses Shadcn: shadcn-ui@latest init


Auth  using clerk: 
npm install @clerk/nextjs
Followed Docs: https://clerk.com/docs/nextjs/get-started-with-nextjs
Need to make sure middleware is at root of project (src) not in app
There is an<UserButton afterSignOutUrl="/" /> to redirect

Font:
We want to use Montserrat for the logo only.
Using cn to apply the classnames

Prisma
npx prisma db push
npx prisma generate

PlanetScale for the DB



// zustand store 
// https://www.npmjs.com/package/zustand#typescript-usage
in hooks/use-pro-modal.tsx
Holds the state and functions to open and close the modal

STRIPE for payment processing
https://dashboard.stripe.com/
created new account: AI-Studio
Webhook- two events- checkout session completed and invoice payment succeded
Change from localhost to production- add an endpoint https://dashboard.stripe.com/test/webhooks

stripe listen --forward-to localhost:3000/webhook

React-hot-toast for notifications

Support provided via CRISP
https://crisp.chat/en/
