import {styled} from "@mui/material/styles";
import {ChangeEvent, memo} from "react";
import usePagination from "@mui/material/usePagination";
import {Button} from "@mui/joy";

import NavigateNextRounded from '@mui/icons-material/NavigateNextRounded';
import NavigateBeforeRounded from '@mui/icons-material/NavigateBeforeRounded';

const List = styled('ul')({
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    gap: 3,
    alignItems: "center"
});

interface CrmPaginationProps {
    count: number,
    page: number,

    onChange(event: ChangeEvent<unknown>, value: number): void
}

export const CrmPagination = memo((props: CrmPaginationProps) => {
    const {items} = usePagination({
        count: props.count,
        onChange: props.onChange,
        page: props.page
    });

    return (
        <nav>
            <List>
                {items.map(({page, type, selected, ...item}, index) => {
                    let children = null;

                    if (type === 'start-ellipsis' || type === 'end-ellipsis') {
                        children = (
                            <div
                                style={{
                                    letterSpacing: "0.15em",
                                    minWidth: "32px",
                                    fontSize: "0.875rem",
                                    lineHeight: "1.43",
                                    boxSizing: "border-box",
                                    height: "auto",
                                    padding: "0 6px",
                                    textAlign: "center",
                                    fontWeight: 400
                                }}
                            >
                                ...
                            </div>
                        );
                    } else if (type === 'page') {
                        children = (
                            <Button
                                size={"sm"}
                                variant={"outlined"}
                                type="button"
                                style={{
                                    letterSpacing: "0.01071em",
                                    minWidth: "32px",
                                    fontSize: "0.875rem",
                                    lineHeight: "1.43",
                                    boxSizing: "border-box",
                                    height: "32px",
                                    padding: "0 6px",
                                    backgroundColor: selected ? "#1976d21f" : undefined
                                }}
                                {...item}
                            >
                                {page}
                            </Button>
                        );
                    } else {
                        children = (
                            <Button
                                size={"sm"}
                                variant={"outlined"}
                                type="button"
                                style={{
                                    letterSpacing: "0.01071em",
                                    minWidth: "32px",
                                    fontSize: "0.875rem",
                                    lineHeight: "1.43",
                                    boxSizing: "border-box",
                                    height: "32px",
                                    padding: "0 6px",
                                    backgroundColor: selected ? "#1976d21f" : undefined,
                                    marginRight: type === "previous" ? "5px" : undefined,
                                    marginLeft: type !== "previous" ? "5px" : undefined
                                }}
                                {...item}
                            >
                                {type === "previous" ? (
                                    <NavigateBeforeRounded/>
                                ) : (
                                    <NavigateNextRounded/>
                                )}
                            </Button>
                        );
                    }

                    return <li key={index}>{children}</li>;
                })}
            </List>
        </nav>
    );
})