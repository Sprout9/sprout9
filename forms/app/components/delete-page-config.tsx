import NullableConfig from "@/app/components/nullable-config"
import { DeletePage } from "@/app/components/buttons"
import { useState } from "react"

export default function DeletePageConfig({ deletePage }: { deletePage: () => void }) {
    const [isVisible, setVisible] = useState(false)

    return (
        <NullableConfig
            nullableConfig={isVisible}
            onToggle={() => setVisible(!isVisible)}
            id="delete-page-button"
        >
            <DeletePage action={() => {
                setVisible(false)
                deletePage()
            }} />
        </NullableConfig>
    )
} 