import {useAtom, WritableAtom} from "jotai";
import {CrmField, CrmOrderBy} from "../../entities/entities";
import {Tooltip, Typography} from "@mui/joy";
import {Fragment} from "react";

import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

interface CrmTableHeadProps {
    fields: CrmField[]
    orderByAtom?: WritableAtom<CrmOrderBy | null, [CrmOrderBy], void>
}

const CrmTableHeadSortable = (props: CrmTableHeadProps) => {
    const [orderBy, setOrderBy] = useAtom(props.orderByAtom!)

    const handleOrderBy = (field: string) => {
        if (orderBy) {
            setOrderBy({
                sortable: orderBy.sortable === "asc" ? "desc" : "asc",
                field: field
            })
        }
    }

    return (
        <Fragment>
            {
                props.fields.map((op, i) => (
                    <th
                        key={`column_field_${i}`}
                        style={{
                            cursor: op.sortable ? "pointer" : undefined
                        }}
                        onClick={() => {
                            if (op.sortable) {
                                handleOrderBy(op.key)
                            }
                        }}
                    >
                        <Tooltip
                            title={op.label}
                            placement="top"
                            size="sm"
                        >
                            <Typography
                                level="body-sm"
                                component="span"
                                sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 0.5
                                }}
                            >
                                {op.label}
                                {
                                    orderBy?.field === op.key && (
                                        orderBy.sortable === "asc" ? (
                                            <KeyboardArrowDownRoundedIcon
                                                fontSize="small"
                                            />
                                        ) : (
                                            <KeyboardArrowUpRoundedIcon
                                                fontSize="small"
                                            />
                                        )
                                    )
                                }
                            </Typography>
                        </Tooltip>
                    </th>
                ))
            }
        </Fragment>
    )
}

const CrmTableHeadNotSortable = (props: CrmTableHeadProps) => {
    return (
        <Fragment>
            {
                props.fields.map((op, i) => (
                    <th key={`column_field_${i}`}>
                        <Tooltip
                            title={op.label}
                            placement="top"
                            size="sm"
                        >
                            <Typography
                                level="body-sm"
                                component="span"
                                sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 0.5
                                }}
                            >
                                {op.label}
                            </Typography>
                        </Tooltip>
                    </th>
                ))
            }
        </Fragment>
    )
}

export const CrmTableHead = (props: CrmTableHeadProps) => {
    return props.orderByAtom ? (
        <thead>
        <tr>
            <CrmTableHeadSortable {...props}/>
        </tr>
        </thead>
    ) : (
        <thead>
        <tr>
            <CrmTableHeadNotSortable {...props}/>
        </tr>
        </thead>
    );
};
