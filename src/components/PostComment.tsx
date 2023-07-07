'use client'

import { FC, useRef } from 'react'
import UserAvatar from './UserAvatar'
import { Comment, CommentVote, User } from '@prisma/client'
import { formatTimeToNow } from '@/lib/utils'
import { Button } from './ui/Button'
import CommentVotes from './CommentVotes'
import { MessageSquare } from 'lucide-react'
import { Textarea } from './ui/Textarea'
import { Label } from './ui/Label'

type ExtendedComment = Comment & {
    votes: CommentVote[]
    author: User
}

interface PostCommentProps {
    comment: ExtendedComment
}

const PostComment: FC<PostCommentProps> = ({comment}) => {
  const commentRef = useRef<HTMLDivElement>(null)
  
  return (
    <div ref={commentRef} className='flex flex-col'>
      <div className='flex items-center'>
        <UserAvatar 
          user={{
            name: comment.author.name || null,
            image: comment.author.image || null
          }}
          className='h-6 w-6'
        />

        <div className='ml-2 flex items-center gap-x-2'>
          <p className='text-sm font-medium text-gray-900'>
            u/{comment.author.username}
          </p>
          <p className='max-h-40 truncate text-xs text-zinc-500'>
            {formatTimeToNow(new Date(comment.createdAt))}
          </p>
        </div>
      </div>
      <p className='text-sm text-zinc-900 mt-2'>{comment.text}</p>
  {/* <div className='flex gap-2 items-center'>
        <CommentVotes
          commentId={comment.id}
          votesAmount={votesAmount}
          currentVote={currentVote}
        />

        <Button
          onClick={() => {
            if (!session) return router.push('/sign-in')
            setIsReplying(true)
          }}
          variant='ghost'
          size='xs'
        >
          <MessageSquare className='h-4 w-4 mr-1.5' />
          Reply
        </Button>
      </div>

          {isReplying ? (
          <div className='grid w-full gap-1.5'>
            <Label htmlFor='comment'>Your comment</Label>
            <div className='mt-2'>
              
            <Textarea
            id='comment'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={1}
            placeholder='What are your thoughts?'
          />

              <div className='mt-2 flex justify-end gap-2'>
                <Button
                  tabIndex={-1}
                  variant='subtle'
                  onClick={() => setIsReplying(false)}>
                  Cancel
                </Button>
                <Button
                  isLoading={isLoading}
                  onClick={() => {
                    if (!input) return
                    postComment({
                      postId,
                      text: input,
                      replyToId: comment.replyToId ?? comment.id, // default to top-level comment
                    })
                  }}>
                  Post
                </Button>
              </div>
            </div>
            </div>
          ) : null} */}
    </div>
  )
}

export default PostComment