import { downloadUserData } from "@/app/lib/data"

export const dynamic = 'force-dynamic'
export async function GET() {

    const res = await downloadUserData()

    return new Response(JSON.stringify(res), {
        status: 200,
        headers: {
            'Content-Disposition': 'attachment; filename=userdata.json',
            'Content-Type': 'application/json'
        }
    })
}