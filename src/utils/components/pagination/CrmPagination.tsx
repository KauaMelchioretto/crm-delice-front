import {styled} from "@mui/material/styles";
import {ChangeEvent, memo} from "react";
import usePagination from "@mui/material/usePagination";
import {Box, Button} from "@mui/joy";

import NavigateNextRounded from '@mui/icons-material/NavigateNextRounded';
import NavigateBeforeRounded from '@mui/icons-material/NavigateBeforeRounded';
import {PrimitiveAtom, useAtom, useAtomValue} from "jotai/index";
import {Atom} from "jotai";
import {Loadable} from "jotai/vanilla/utils/loadable";

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

interface CrmPaginationAtomProps {
    page: PrimitiveAtom<number>
    count: Atom<Loadable<Promise<number>>>
}

export const CrmPaginationAtom = (props: CrmPaginationAtomProps) => {
    const [page, setPage] = useAtom(props.page);
    const pageCount = useAtomValue(props.count);

    if (pageCount.state === "loading") return;

    const count = pageCount.state === "hasData" ? pageCount.data : 0;
    const handleChange = (_: ChangeEvent<unknown>, value: number) => {
        setPage(--value);
    };

    return (
        <Box
            sx={{
                flex: 1,
                width: "100%",
                mt: "auto",
                display: "flex",
                alignItems: "end"
            }}
        >
            <CrmPagination page={page + 1} count={count} onChange={handleChange}/>
        </Box>
    );
}