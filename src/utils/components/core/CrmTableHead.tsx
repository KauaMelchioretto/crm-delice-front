import {Atom, useAtom, WritableAtom} from "jotai";
import {CrmField, CrmOrderBy} from "../../entities/entities";
import {ArrowDownwardRounded, ArrowUpwardRounded} from "@mui/icons-material";

interface CrmTableHeadProps {
    field: CrmField;
    orderByAtom: Atom<CrmOrderBy | null>;
}

export const CrmTableHead = ({field, orderByAtom}: CrmTableHeadProps) => {
    const [orderBy, setOrderBy] = useAtom(
        orderByAtom as WritableAtom<CrmOrderBy | null, [CrmOrderBy], void>
    );

    const handleClickColumn = (field: string) => {
        if (orderBy?.ordenation === "asc") {
            setOrderBy({field: field, ordenation: "desc"});
        } else {
            setOrderBy({field: field, ordenation: "asc"});
        }
    };

    return (
        <th
            style={{cursor: "pointer"}}
            onClick={() => handleClickColumn(field.value)}
        >
            <span title={field.value.toUpperCase()}>{field.label}</span>
            {orderBy?.field === field.value &&
                (orderBy.ordenation === "asc" ? (
                    <ArrowDownwardRounded fontSize="small"/>
                ) : (
                    <ArrowUpwardRounded fontSize="small"/>
                ))}
        </th>
    );
};
