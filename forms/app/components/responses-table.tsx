import Pagination from '@/app/components/pagination'
import { fetchResponses, fetchTotalResponses } from '@/app/lib/data'

export default async function ResponsesTable({
    formId,
    searchParams,
}: {
    formId: string,
    searchParams?: {
        page?: string;
    };
}) {
    const currentPage = Number(searchParams?.page) || 1;
    const tableHeaders = [
        <div key={1}>Page</div>,
        <div key={2}>Input</div>,
        <div key={3}>Question</div>,
        <div key={4}>Label</div>,
        <div key={5}>Response</div>,
    ]

    const itemsPerPage = 3

    const [responses, totalResponses] = await Promise.all([
        fetchResponses(formId, itemsPerPage, currentPage),
        fetchTotalResponses(formId)
    ])

    const pages = Math.floor((Math.max(1, totalResponses) - 1) / itemsPerPage) + 1

    return (
        <div className="forms-table-padding">
            <div className="forms-table">
                <div className="forms-table-header">Forms / {responses[0].title}</div>

                {responses.map(resp => (

                    <div key={resp.id} className="table-bg">
                        <table>
                            <thead>
                                <tr>
                                    {tableHeaders.map((header, index) => (
                                        <th scope='col' key={index}>
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {resp.responses.map((input, index) => (
                                    <tr key={index}>
                                        <td><div>{input.page}</div></td>
                                        <td><div>{input.input}</div></td>
                                        <td><div>{input.question}</div></td>
                                        <td><div>{input.label}</div></td>
                                        <td><div>{input.response}</div></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}

                <Pagination totalForms={pages} />
            </div>
        </div>
    )
}
