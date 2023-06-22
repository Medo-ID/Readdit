'use client'

import { useCustomToast } from '@/hooks/use-custom-toast'
import { usePrevious } from '@mantine/hooks'
import { VoteType } from '@prisma/client'
import { FC, useEffect, useState } from 'react'
import { Button } from '../ui/Button'
import { ArrowBigDown, ArrowBigUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PostVoteClientProps {
  postId: string,
  initialVoteAmount: number,
  initialVote?: VoteType | null
}

const PostVoteClient: FC<PostVoteClientProps> = ({postId, initialVoteAmount, initialVote}) => {
    const { loginToast } = useCustomToast()
    const [votesAmount, setVoteAmount] = useState<number>(initialVoteAmount)
    const [currentVote, setCurrentVote] = useState(initialVote)
    const previousVote = usePrevious(currentVote)

    useEffect(() => {
        setCurrentVote(initialVote)
    }, [initialVote])
    
    return (
        <div className='flex sm:flex-col gap-4 sm:gap-0 pr-6 sm:w-20 pb-4 sm:pb-0'>
            
            <Button size='sm' variant='ghost' aria-label='upvote'>
                <ArrowBigUp 
                    className={cn('h-5 w-5 text-zinc-700', {
                        'text-emerald-500 fill-emerald-500': currentVote === 'UP'
                    })}
                />
            </Button>
            <p className='text-center py-2 font-medium text-sm text-zinc-900'>{votesAmount}</p>
            
            <Button size='sm' variant='ghost' aria-label='downvote'>
                <ArrowBigDown 
                    className={cn('h-5 w-5 text-zinc-700', {
                        'text-red-500 fill-red-500': currentVote === 'DOWN'
                    })}
                />
            </Button>
        
        </div>
    )
}

export default PostVoteClient