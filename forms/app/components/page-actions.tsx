import DeletePageConfig from "@/app/components/delete-page-config"


export default function PageActions({ deletePage }: { deletePage: () => void }) {
    return (
        <div className="page-actions">
            <DeletePageConfig deletePage={deletePage} />
        </div>
    )
}