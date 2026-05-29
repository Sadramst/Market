declare module '../../app/*' {
  const Page: any
  export default Page
  export const GET: any
  export const POST: any
  export const PUT: any
  export const PATCH: any
  export const DELETE: any
  export const HEAD: any
  export const OPTIONS: any
  export const generateStaticParams: any
  export const generateMetadata: any
}

declare module '../../app/*/*/page.js' {
  const Page: any
  export default Page
  export const generateStaticParams: any
  export const generateMetadata: any
}

declare module '../../app/api/*/route.js' {
  export const GET: any
  export const POST: any
  export const PUT: any
  export const PATCH: any
  export const DELETE: any
  export const HEAD: any
  export const OPTIONS: any
}
