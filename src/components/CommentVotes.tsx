'use client'
import { Button } from '@/components/ui/Button'
import { toast } from '@/hooks/use-toast'
import { useCustomToast } from '@/hooks/use-custom-toast'
import { cn } from '@/lib/utils'
import { CommentVoteRequest } from '@/lib/validators/vote'
import { usePrevious } from '@mantine/hooks'
import { CommentVote, VoteType } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { ArrowBigDown, ArrowBigUp } from 'lucide-react'
import { FC, useState } from 'react'

interface CommentVotesProps {
  commentId: string
  initialVotesAmount: number
  initialVote?: PartialVote
}

type PartialVote = Pick<CommentVote, 'type'>

const CommentVotes: FC<CommentVotesProps> = ({
  commentId,
  initialVotesAmount,
  initialVote,
}) => {
  const { loginToast } = useCustomToast()
  const [votesAmount, setvotesAmount] = useState<number>(initialVotesAmount)
  const [currentVote, setCurrentVote] = useState<PartialVote | undefined>(initialVote)
  const prevVote = usePrevious(currentVote)

  const { mutate: vote } = useMutation({
    mutationFn: async (type: VoteType) => {
      const payload: CommentVoteRequest = {
        voteType: type,
        commentId,
      }

      await axios.patch('/api/subreddit/post/comment/vote', payload)
    },
    onError: (err, voteType) => {
      if (voteType === 'UP') setvotesAmount((prev) => prev - 1)
      else setvotesAmount((prev) => prev + 1)

      // reset current vote
      setCurrentVote(prevVote)

      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast()
        }
      }

      return toast({
        title: 'Something went wrong.',
        description: 'Your vote was not registered. Please try again.',
        variant: 'destructive',
      })
    },
    onMutate: (type: VoteType) => {
      if (currentVote?.type === type) {
        // User is voting the same way again, so remove their vote
        setCurrentVote(undefined)
        if (type === 'UP') setvotesAmount((prev) => prev - 1)
        else if (type === 'DOWN') setvotesAmount((prev) => prev + 1)
      } else {
        // User is voting in the opposite direction, so subtract 2
        setCurrentVote({ type })
        if (type === 'UP') setvotesAmount((prev) => prev + (currentVote ? 2 : 1))
        else if (type === 'DOWN')
          setvotesAmount((prev) => prev - (currentVote ? 2 : 1))
      }
    },
  })

  return (
    <div className='flex gap-1'>
      {/* upvote */}
      <Button
        onClick={() => vote('UP')}
        size='xs'
        variant='ghost'
        aria-label='upvote'>
        <ArrowBigUp
          className={cn('h-5 w-5 text-zinc-700', {
            'text-[#03A9F4] fill-[#03A9F4]': currentVote?.type === 'UP',
          })}
        />
      </Button>

      {/* score */}
      <p className='text-center py-2 px-1 font-medium text-xs text-zinc-900'>
        {votesAmount}
      </p>

      {/* downvote */}
      <Button
        onClick={() => vote('DOWN')}
        size='xs'
        className={cn({
          'text-[#03A9F4]': currentVote?.type === 'DOWN',
        })}
        variant='ghost'
        aria-label='downvote'>
        <ArrowBigDown
          className={cn('h-5 w-5 text-zinc-700', {
            'text-[#D84315] fill-[#D84315]': currentVote?.type === 'DOWN',
          })}
        />
      </Button>
    </div>
  )
}

export default CommentVotes