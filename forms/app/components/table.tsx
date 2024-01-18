
export default async function Table({
    headers,
    rows,
}: {
    headers: React.JSX.Element[],
    rows: {
        key: string,
        fields: React.JSX.Element[]
    }[]
}) {


    return (
        <div className="table-bg">
            <div className="table-cards">
                {rows.map(row => (
                    <div key={row.key} className="table-card">
                        <div className="name-status">
                            <div className="name-title">
                                <div className="title">
                                    {row.fields[1]}
                                </div>
                                <div className="name">
                                    {row.fields[0]}
                                </div>
                            </div>
                            {row.fields[2]}
                        </div>
                        <div className="divider">
                        </div>
                        <div className="responses-buttons">
                            <div className="responses">
                                Responses:
                                {row.fields[3]}
                            </div>
                            {row.fields[4]}
                        </div>
                    </div>
                ))}
            </div>
            <table>
                <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <th scope='col' key={index}>
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map(row => (
                        <tr key={row.key}>
                            {row.fields.map((field, index) => (
                                <td key={index}>
                                    {field}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}