import Table from '@/app/components/table'
import Search from '@/app/components/search'
import Pagination from '@/app/components/pagination'
import { UpdateForm, DeleteForm, CreateForm, ViewResponses, DownloadUserData } from '@/app/components/buttons'
import { fetchFilteredForms, fetchFormsTotal } from '@/app/lib/data'
import { CheckIcon, ClockIcon } from '@/app/components/icons'

export default async function FormsTable({
    searchParams,
}: {
    searchParams?: {
        query?: string;
        page?: string;
    };
}) {
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const tableHeaders = [
        <div>Creator</div>,
        <div>Title</div>,
        <div>Status</div>,
        <div>Responses</div>,
        <div></div>
    ]

    const itemsPerPage = 6

    const forms = await fetchFilteredForms(itemsPerPage, query, currentPage)
    const tableRows = forms.map(form => {

        return {
            key: form.form.id,
            fields: [
                <div>{`${form.first_name} ${form.last_name}`}</div>,
                <div>{form.form.title}</div>,
                <div><FormStatus published={form.form.published} /></div>,
                <div><ViewResponses id={form.form.id} responses={form.form.responses} /></div>,
                <div className="table-buttons">
                    <UpdateForm id={form.form.id} />
                    <DeleteForm id={form.form.id} />
                </div>
            ]
        }
    })

    const totalForms = await fetchFormsTotal(query)
    const pages = Math.floor((Math.max(1, totalForms) - 1) / itemsPerPage) + 1

    return (
        <div className="forms-table-padding">
            <div className="forms-table">
                <div className="forms-table-header">Forms</div>
                <div className="forms-table-search">
                    <Search placeholder="Search forms..." />
                    <CreateForm />
                    <DownloadUserData />
                </div>
                <Table headers={tableHeaders} rows={tableRows} />
                <Pagination totalForms={pages} />
            </div>
        </div>
    )
}

function FormStatus({ published }: { published: boolean }) {
    return (
        <span className={`form-status ${published ? "published" : ""}`}>
            {published ? "Published" : "Unpublished"}
            {published ? <CheckIcon /> : <ClockIcon />}

        </span>
    )
}