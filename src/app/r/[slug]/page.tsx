import MiniCreatePost from '@/components/MiniCreatePost'
import PostFeed from '@/components/PostFeed'
import { INFINIT_SCROLLING_PAGINATION_RESULTS } from '@/config'
import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface PageProps {
  params: {
    slug: string
  }
}

const page = async({params}: PageProps) => {
  const {slug} = params
  const session = await getAuthSession()
  const subreddit = await db.subreddit.findFirst({
    where: {name: slug},
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          subreddit: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: INFINIT_SCROLLING_PAGINATION_RESULTS
      }
    }
  })

  if(!subreddit) return notFound()

  return <>
    <Link href='/' className='flex items-center justify-start'><ChevronLeft className='w-4 h-4 text-zinc-700'/><p className='text-sm text-zinc-700 underline underline-offset-2'>Back Home</p></Link>
    <h1 className='font-bold text-3xl md:text-4xl h-14'>
      r/{subreddit.name}
    </h1>
    <MiniCreatePost session={session}/>
    <PostFeed initialPosts={subreddit.posts} subredditName={subreddit.name} />
  </>
}

export default page