'use client'

import Link from 'next/link'
import clsx from '@/app/lib/clsx'
import { usePathname, useSearchParams } from 'next/navigation'
import { ArrowLeftIcon, ArrowRightIcon } from '@/app/components/icons'

export default function Pagination({ totalForms }: { totalForms: number }) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const currentPage = Number(searchParams.get('page')) || 1

    const allForms = generatePagination(currentPage, totalForms)

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams)
        params.set('page', pageNumber.toString())
        return `${pathname}?${params.toString()}`
    }
    let middleCounter = 0

    return (
        <div className="pagination">
            <PaginationArrow
                direction="left"
                href={createPageURL(currentPage - 1)}
                isDisabled={currentPage <= 1}
            />

            <div className="pagination-numbers">
                {allForms.map((page, index) => {
                    let position: 'first' | 'last' | 'single' | 'middle' | undefined

                    if (index === 0) position = 'first'
                    if (index === allForms.length - 1) position = 'last'
                    if (allForms.length === 1) position = 'single'
                    if (page === '...') position = 'middle'

                    let key = page
                    if (page === '...') key += (middleCounter++).toString()

                    return (
                        <PaginationNumber
                            key={key}
                            href={createPageURL(page)}
                            page={page}
                            position={position}
                            isActive={currentPage === page}
                        />
                    )
                })}
            </div>

            <PaginationArrow
                direction="right"
                href={createPageURL(currentPage + 1)}
                isDisabled={currentPage >= totalForms}
            />
        </div>
    )
}

function PaginationNumber({
    page,
    href,
    isActive,
    position,
}: {
    page: number | string
    href: string
    position?: 'first' | 'last' | 'middle' | 'single'
    isActive: boolean
}) {
    const className = clsx(
        `pagination-number ${position || ''}`,
        {
            'active': isActive,
            'disabled': !isActive && position !== 'middle',
        },
    )

    return isActive || position === 'middle' ? (
        <div className={className}>{page}</div>
    ) : (
        <Link href={href} className={className}>
            {page}
        </Link>
    )
}

function PaginationArrow({
    href,
    direction,
    isDisabled,
}: {
    href: string
    direction: 'left' | 'right'
    isDisabled?: boolean
}) {
    const className = clsx(
        `pagination-arrow ${direction}`,
        {
            'disabled': isDisabled,
            'active': !isDisabled,
        },
    )

    const icon = direction === 'left' ? (<ArrowLeftIcon />) : (<ArrowRightIcon />)

    return isDisabled ? (
        <div className={className}>{icon}</div>
    ) : (
        <Link className={className} href={href}>
            {icon}
        </Link>
    )
}


export const generatePagination = (currentPage: number, totalForms: number) => {
    // If the total number of Forms is 7 or less,
    // display all Forms without any ellipsis.
    if (totalForms <= 7) {
        return Array.from({ length: totalForms }, (_, i) => i + 1)
    }

    // If the current page is among the first 3 Forms,
    // show the first 3, an ellipsis, and the last 2 Forms.
    if (currentPage <= 3) {
        return [1, 2, 3, '...', totalForms - 1, totalForms]
    }

    // If the current page is among the last 3 Forms,
    // show the first 2, an ellipsis, and the last 3 Forms.
    if (currentPage >= totalForms - 2) {
        return [1, 2, '...', totalForms - 2, totalForms - 1, totalForms]
    }

    // If the current page is somewhere in the middle,
    // show the first page, an ellipsis, the current page and its neighbors,
    // another ellipsis, and the last page.
    return [
        1,
        '...',
        currentPage - 1,
        currentPage,
        currentPage + 1,
        '...',
        totalForms,
    ]
}
