import { Atom, useAtom, WritableAtom } from "jotai";
import { CrmField, CrmOrderBy } from "../../entities/entities";
import { ArrowDownwardRounded, ArrowUpwardRounded } from "@mui/icons-material";
import { Tooltip, Typography } from "@mui/joy";

interface CrmTableHeadProps {
  field: CrmField;
  orderByAtom: Atom<CrmOrderBy | null> | null;
}

const CrmTableHeadField = ({ field, orderByAtom }: CrmTableHeadProps) => {
  const [orderBy, setOrderBy] = useAtom(
    orderByAtom as WritableAtom<CrmOrderBy | null, [CrmOrderBy], void>
  );

  const handleClickColumn = (field: string) => {
    if (orderBy?.ordenation === "asc") {
      setOrderBy({ field, ordenation: "desc" });
    } else {
      setOrderBy({ field, ordenation: "asc" });
    }
  };

  return (
    <th
      style={{ cursor: "pointer" }}
      onClick={() => handleClickColumn(field.value)}
    >
      <Tooltip title={field.value.toUpperCase()} placement="top" size="sm">
        <Typography
          level="body-sm"
          component="span"
          sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}
        >
          {field.label}
          {orderBy?.field === field.value &&
            (orderBy.ordenation === "asc" ? (
              <ArrowDownwardRounded fontSize="small" />
            ) : (
              <ArrowUpwardRounded fontSize="small" />
            ))}
        </Typography>
      </Tooltip>
    </th>
  );
};

const CrmTableHeadAction = ({ field }: { field: CrmField }) => {
  return (
    <th>
      <Typography
        level="body-sm"
        component="span"
        sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}
      >
        {field.label}
      </Typography>
    </th>
  );
};

export const CrmTableHead = ({ field, orderByAtom }: CrmTableHeadProps) => {
  return orderByAtom ? (
    <CrmTableHeadField field={field} orderByAtom={orderByAtom} />
  ) : (
    <CrmTableHeadAction field={field} />
  );
};
