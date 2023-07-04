import { Post, Vote, VoteType } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import PostVoteClient from './PostVoteClient'

interface PostVoteServerProps {
  postId: string
  initialVoteAmount?: number
  initialVote: VoteType | null
  getData?: () => Promise<(Post & {votes: Vote[]}) | null>
}

const wait = (ms: number) => new Promise((res) => setTimeout(res, ms))

const PostVoteServer = async({
    postId, initialVoteAmount, initialVote, getData
}: PostVoteServerProps) => {

    const session = await getServerSession()

    let _votesAmount: number = 0
    let _currentVote: VoteType | null | undefined = undefined

    if(getData){
        await wait(2000)
        const post = await getData()
        if(!post) return notFound()

        _votesAmount = post.votes.reduce((accumulator, vote) => {
            if(vote.type === 'UP') return accumulator + 1
            if(vote.type === 'DOWN') return accumulator -1
            return accumulator
        }, 0)

        _currentVote = post.votes.find((vote) => vote.userId === session?.user.id)?.type
    }else{
        _votesAmount = initialVoteAmount!
        _currentVote = initialVote
    }

  return <PostVoteClient 
            postId={postId}
            initialVoteAmount={_votesAmount}
            initialVote={_currentVote} 
        />
}

export default PostVoteServer