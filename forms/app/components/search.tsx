'use client'

import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import debounce from '@/app/lib/debounce'
import { MagnifyingGlassIcon } from '@/app/components/icons'

export default function Search({ placeholder }: { placeholder: string }) {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()

    const handleSearch = debounce((term: string) => {

        const params = new URLSearchParams(searchParams)
        params.set('page', '1')
        if (term.toString()) {
            params.set('query', term)
        } else {
            params.delete('query')
        }
        replace(`${pathname}?${params.toString()}`)
    })

    return (
        <div className="text-input">
            <input
                id="search"
                className="text-input-input"
                placeholder={placeholder}
                onChange={(e) => { handleSearch(e.target.value) }}
                defaultValue={searchParams.get('query')?.toString()}
            />

            <MagnifyingGlassIcon />
        </div>
    )
}
