import {Box, Breadcrumbs, Typography, Link, CircularProgress, Button, Chip} from "@mui/joy";
import {CrmTitleContainer} from "../../../utils/components/core/CrmTitleContainer.tsx";
import {useAtomValue} from "jotai";
import KanbanState from "../state/KanbanState.ts";
import {useNavigate} from "react-router-dom";
import {CrmContainer} from "../../../utils/components/core/CrmContainer.tsx";
import {useSetAtom} from "jotai/index";
import CrmState from "../../../utils/state/CrmState.ts";
import {CrmFormType} from "../../../utils/entities/entities.ts";
import LayersRoundedIcon from "@mui/icons-material/LayersRounded";
import LeaderboardRoundedIcon from "@mui/icons-material/LeaderboardRounded";
import {Column} from "../entities/entities.ts";
import {Empty} from "antd";
import AddchartRoundedIcon from '@mui/icons-material/AddchartRounded';
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded';
import SchemaRoundedIcon from '@mui/icons-material/SchemaRounded';
import {useTheme} from "@mui/material";

import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';
import {Fragment} from "react";

export const RuleBoardPage = () => {
    const setFormType = useSetAtom(CrmState.FormType);
    const setEntityUUID = useSetAtom(CrmState.EntityFormUUID);

    const board = useAtomValue(KanbanState.BoardAtom)

    const {loading} = KanbanState.useLoadBoard()

    const navigate = useNavigate()

    if (loading) {
        return (
            <Box
                sx={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <CircularProgress/>
            </Box>
        )
    }

    if (!board) {
        return (
            <Box
                sx={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <Empty description={"Board not found"}/>
            </Box>
        )
    }

    const crumbs = [
        {
            label: "Quadros",
            nav: () => navigate(-1)
        },
        {
            label: board?.title,
            nav: () => navigate(0)
        },
        {
            label: "Regras"
        }
    ]

    return (
        <Box
            sx={{
                height: "100%",
                width: "100%",
                gap: 2,
                display: "flex",
                flexDirection: "column",
            }}
        >
            <CrmTitleContainer
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "start",
                }}
            >
                <Box
                    sx={{
                        gap: 0.5,
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Typography
                        level={"body-lg"}
                        fontWeight={"bold"}
                    >
                        Regras
                    </Typography>
                    <Breadcrumbs sx={{p: 0}}>
                        {
                            crumbs.map((item) => (
                                <Link
                                    level={"body-xs"}
                                    color={"neutral"}
                                    onClick={() => {
                                        if (item.nav) {
                                            item.nav()
                                        }
                                    }}
                                >
                                    {item.label}
                                </Link>
                            ))
                        }
                    </Breadcrumbs>
                </Box>
                <Box
                    sx={{
                        gap: 0.5,
                        display: "flex",
                        flexDirection: "row",
                    }}
                >
                    <Button
                        size={"sm"}
                        onClick={() => {
                            setFormType(CrmFormType.EDIT_TAGS)
                            setEntityUUID(board?.uuid ?? "")
                        }}
                        startDecorator={<LayersRoundedIcon/>}
                    >
                        Cadastrar tags
                    </Button>
                    <Button
                        size={"sm"}
                        onClick={() => {
                            setFormType(CrmFormType.EDIT_COLUMNS)
                            setEntityUUID(board?.uuid ?? "")
                        }}
                        startDecorator={<LeaderboardRoundedIcon/>}
                    >
                        Cadastrar colunas
                    </Button>
                </Box>
            </CrmTitleContainer>
            <Box display={"flex"} gap={2}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        height: "-webkit-fill-available",
                        gap: 1,
                    }}
                >
                    <CrmContainer
                        sx={{
                            display: "flex",
                            width: "100%",
                            overflowX: "hidden",
                            height: "-webkit-fill-available",
                            borderRadius: "8px",
                            p: 0,
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                width: "100%",
                                overflowX: "auto",
                                height: "100%",
                                gap: 1,
                                p: 1
                            }}
                        >
                            {
                                board?.columns?.map(x => <EditColumn {...x}/>)
                            }
                        </Box>
                    </CrmContainer>
                </Box>
            </Box>
        </Box>
    )
}

const EditColumn = (props: Column) => {
    const theme = useTheme()
    const setFormType = useSetAtom(CrmState.FormType);
    const setColumnUUID = useSetAtom(CrmState.EntityFormUUID);

    const board = useAtomValue(KanbanState.BoardAtom)

    if(board == null) {
        return <Fragment/>
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minWidth: "250px",
                maxWidth: "250px",
                flex: "0 0 auto",
                gap: 2
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    pt: 1,
                    pb: 1,
                    position: "relative",
                    borderRadius: "8px",
                    boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
                    backgroundColor: "background.level1",
                }}
            >
                <Typography
                    level={"body-md"}
                    fontWeight={"bold"}
                >
                    {props.title}
                </Typography>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    justifyContent: "start",
                    gap: 1,
                    borderRadius: "8px",
                    width: "100%",
                    position: "relative",
                    p: 0.5,
                    backgroundColor: "background.level1",
                }}
            >
                <Button
                    variant={"outlined"}
                    startDecorator={<AddchartRoundedIcon/>}
                    onClick={() => {
                        setFormType(CrmFormType.REGISTER_RULE)
                        setColumnUUID(props.uuid ?? "")
                    }}
                >
                    Adicionar regra
                </Button>
                <Button
                    variant={"outlined"}
                    startDecorator={<SchemaRoundedIcon/>}
                    onClick={() => {
                        setFormType(CrmFormType.REGISTER_ALLOWED_COLUMN)
                        setColumnUUID(props.uuid ?? "")
                    }}
                >
                    Permitir coluna
                </Button>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        mt: 2,
                        width: "100%"
                    }}
                >
                    {props.rules && props.rules.map((rule) => (
                        <Chip
                            key={`column_rule_${rule.uuid}`}
                            variant={"outlined"}
                            color={"warning"}
                            sx={{
                                minWidth: "100%",
                                pt: 0.5,
                                pb: 0.5,
                                borderRadius: theme.spacing(1),
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: 5
                                }}
                            >
                                <VerifiedUserRoundedIcon/>
                                {rule.title}
                            </div>
                        </Chip>
                    ))}
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        mt: "auto",
                        width: "100%"
                    }}
                >
                    {props.allowedColumns && props.allowedColumns.filter(x => x !== props.uuid).map((allowed) => {
                        const column = board.columns?.find(c => c.uuid === allowed)

                        return (
                            <Chip
                                key={`column_allowed_${allowed}`}
                                variant={"outlined"}
                                color={"success"}
                                sx={{
                                    minWidth: "100%",
                                    pt: 0.5,
                                    pb: 0.5,
                                    borderRadius: theme.spacing(1),
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        gap: 5
                                    }}
                                >
                                    <AccountTreeRoundedIcon/>
                                    {column?.title}
                                </div>
                            </Chip>
                        )
                    })}
                </Box>
            </Box>
        </Box>
    )
}