import Table from '@/app/components/table'
import Search from '@/app/components/search'
import Pagination from '@/app/components/pagination'
import { UpdateForm, DeleteForm, CreateForm, ViewResponses, DownloadUserData } from '@/app/components/buttons'
import { CheckIcon, ClockIcon } from '@/app/components/icons'
import { UserWithForm } from '@/app/lib/types'

export default async function FormsTable({
    searchParams,
    createForm,
    deleteForm,
    fetchFilteredForms,
    fetchFormsTotal
}: {
    searchParams?: {
        query?: string;
        page?: string;
    },
    createForm: () => Promise<void>,
    deleteForm: (id: string) => Promise<void>,
    fetchFilteredForms: (itemsPerPage: number, query: string, currentPage: number) => Promise<UserWithForm[]>,
    fetchFormsTotal: (query: string) => Promise<number>
}) {
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const tableHeaders = [
        <div key={1}>Creator</div>,
        <div key={2}>Title</div>,
        <div key={3}>Status</div>,
        <div key={4}>Responses</div>,
        <div key={5}></div>
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
                    <DeleteForm id={form.form.id} deleteForm={deleteForm} />
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
                    <CreateForm createForm={createForm} />
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