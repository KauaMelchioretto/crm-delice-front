import {ComponentProps} from "react";
import {styled, Table} from "@mui/joy";

export const DefaultCrmTable = styled(Table)(() => ({
    "& thead th": {
        height: "20px",
        borderTopStyle: "unset !important",
        borderTopWidth: "unset !important",
        borderTopColor: "unset !important",
        borderRadius: "unset !important",
    },
}))

export const CrmTable = (props: ComponentProps<typeof Table>) => (
    <DefaultCrmTable
        borderAxis="x"
        color="neutral"
        size="sm"
        stickyFooter={false}
        stickyHeader
        variant="plain"
        hoverRow
        {...props}
    />
)