import { downloadUserData } from "@/app/lib/data"
import { unstable_noStore as noStore } from 'next/cache';

export const dynamic = 'force-dynamic'
export async function GET() {
    noStore()
    const res = await downloadUserData()

    return new Response(JSON.stringify(res), {
        status: 200,
        headers: {
            'Content-Disposition': 'attachment; filename=userdata.json',
            'Content-Type': 'application/json'
        }
    })
}