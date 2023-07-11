import { db } from "@/lib/db"

export async function GET(req: Request){
    const url = new URL(req.url)
    const query = url.searchParams.get('query')

    if(!query) return new Response('Invalid query', {status: 400})

    const results = await db.subreddit.findMany({
        where: {
            name: {
                startsWith: query
            }
        },
        include: {
            _count: true,
        },
        take: 5
    })

    return new Response(JSON.stringify(results))

}