import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { redis } from "@/lib/redis"
import { PostVoteValidator } from "@/lib/validators/vote"
import { CachedPost } from "@/types/redis"

const CACHE_AFTER_UPVOTES = 1

export async function PATCH(req: Request) {
    try{
        const body = req.json()
        const { postId, voteType } = PostVoteValidator.parse(body)
        const session = await getAuthSession()

        if(!session?.user){
            return new Response('Unauthorized', { status: 401 })
        }
    
        const existingVote = await db.vote.findFirst({
            where: {
                userId: session.user.id,
                postId
            }
        })

        const post = await db.post.findUnique({
            where: {
                id: postId
            },
            include: {
                author: true,
                votes: true
            }
        })

        if(!post){
            return new Response('Post not found', { status: 404 })
        }

        if(existingVote){
            if(existingVote.type === voteType){
                await db.vote.delete({
                    where: {
                        userId_postId: {
                            postId,
                            userId: session.user.id
                        }
                    }
                })

                return new Response('OK')
            }

            await db.vote.update({
                where: {
                    userId_postId: {
                        postId,
                        userId: session.user.id
                    }
                },
                data: {
                    type: voteType
                }
            })

            // recount the votes
            const votesAmount = post.votes.reduce((accumulator, vote) => {
                if(vote.type === 'UP') return accumulator + 1
                if(vote.type === 'DOWN') return accumulator -1
                return accumulator
            }, 0)

            if(votesAmount >= CACHE_AFTER_UPVOTES){
                const cachePayload: CachedPost = {
                    authorUsername: post.author.username ?? '',
                    content: JSON.stringify(post.content),
                    id: post.id,
                    title: post.title,
                    currentVote: voteType,
                    createdAt: post.createdAt
                }
            
                await redis.hset(`post:${postId}`, cachePayload)
        
            }

            return new Response('OK')
        }

        await db.vote.create({
            data: {
                type: voteType,
                userId: session.user.id,
                postId
            }
        })

        // recount the votes
        const votesAmount = post.votes.reduce((accumulator, vote) => {
            if(vote.type === 'UP') return accumulator + 1
            if(vote.type === 'DOWN') return accumulator -1
            return accumulator
        }, 0)

        if(votesAmount >= CACHE_AFTER_UPVOTES){
            const cachePayload: CachedPost = {
                authorUsername: post.author.username ?? '',
                content: JSON.stringify(post.content),
                id: post.id,
                title: post.title,
                currentVote: voteType,
                createdAt: post.createdAt
            }
        
            await redis.hset(`post:${postId}`, cachePayload)
    
        }

        return new Response('OK')
    }
    catch(error){

    }
}