import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import PostComment from "./PostComment"
import CreateComment from "./CreateComment"


interface CommentsSectionProps {
  postId: string
}

const CommentsSection = async ({postId}: CommentsSectionProps) => {

    const session = await getAuthSession()
    const comments = await db.comment.findMany({
        where: {
            postId,
            replyToId: null
        },
        include: {
            author: true,
            votes: true,
            replies: {
                include: {
                    author: true,
                    votes: true
                }
            }
        }
    })

  return <div className="flex flex-col w-full gap-y-4 mt-4">
        <hr className="w-full h-px my-6" />
        
        <CreateComment postId={postId} />
        
        <div className="flex flex-col gap-y-6 mt-4">
        {comments
            .filter((comment) => !comment.replyToId)
            .map((topLevelComment) => {
                const topLevelCommentVotesAmount = topLevelComment.votes.reduce(
                    (accumulator, vote) => {
                        if (vote.type === 'UP') return accumulator + 1
                        if (vote.type === 'DOWN') return accumulator - 1
                        return accumulator
                    }, 0)

                const topLevelCommentVote = topLevelComment.votes.find(
                (vote) => vote.userId === session?.user.id
                )
                
                return(
                    <div key={topLevelComment.id} className="flex flex-col">
                        <div className="mb-2">
                            <PostComment 
                                postId={postId} 
                                votesAmount={topLevelCommentVotesAmount} 
                                currentVote={topLevelCommentVote}
                                comment={topLevelComment} 
                            />
                        </div>
                        {/*  render replies */}
                        {topLevelComment.replies
                            .sort((a, b) => b.votes.length - a.votes.length)
                            .map((reply) => {
                                const replyVotesAmount = reply.votes.reduce(
                                    (accumulator, vote) => {
                                        if (vote.type === 'UP') return accumulator + 1
                                        if (vote.type === 'DOWN') return accumulator - 1
                                        return accumulator
                                    }, 0)
                
                                const replyVote = reply.votes.find(
                                (vote) => vote.userId === session?.user.id
                                )
                                
                                return( 
                                    <div
                                        key={reply.id}
                                        className="ml-2 py-2 pl-4 border-l-2 border-zinc-200"
                                    >
                                        <PostComment
                                            postId={postId}
                                            comment={reply} 
                                            currentVote={replyVote}
                                            votesAmount={replyVotesAmount}
                                        />
                                    </div>
                                )
                            })
                        }
                    </div>
                )
            })
        }
        </div>
    </div>
}

export default CommentsSection