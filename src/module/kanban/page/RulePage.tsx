import {Box, Breadcrumbs, Button, Chip, CircularProgress, Link, Typography} from "@mui/joy";
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

import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import {kanbanUseCase} from "../usecase/kanbanUseCase.ts";
import {popup} from "../../../utils/alerts/Popup.ts";
import { useTranslation } from "react-i18next";

export const RulePage = () => {
    const setFormType = useSetAtom(CrmState.FormType);
    const setEntityUUID = useSetAtom(CrmState.EntityFormUUID);
    const { t } = useTranslation();

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
                <Empty description={t('kanbans.messages.rules_not_found')}/>
            </Box>
        )
    }

    const crumbs = [
        {
            label: t('kanbans.rules.label.board'),
            nav: () => navigate(-1)
        },
        {
            label: board?.title,
            nav: () => navigate(0)
        },
        {
            label: t('kanbans.rules.label.rules')
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
                        {t('kanbans.rules.label.rules')}
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
                        {t('kanbans.rules.actions.register_tags')}
                    </Button>
                    <Button
                        size={"sm"}
                        onClick={() => {
                            setFormType(CrmFormType.EDIT_COLUMNS)
                            setEntityUUID(board?.uuid ?? "")
                        }}
                        startDecorator={<LeaderboardRoundedIcon/>}
                    >
                        {t('kanbans.rules.actions.register_columns')}
                    </Button>
                    <Button
                        size={"sm"}
                        onClick={() => {
                            setFormType(CrmFormType.EDIT_BOARD)
                            setEntityUUID(board?.uuid ?? "")
                        }}
                        startDecorator={<LeaderboardRoundedIcon/>}
                    >
                        {t('kanbans.rules.actions.edit_board')}
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
    const setColumnRuleUUID = useSetAtom(KanbanState.RuleAtomUUID);
    const { t } = useTranslation();
    const board = useAtomValue(KanbanState.BoardAtom)

    const updateList = useSetAtom(KanbanState.UpdateAtom)

    if (board == null) {
        return <Fragment/>
    }

    const handleDeleteColumnRule = (uuid: string) => {
        popup.confirm("question", t('kanbans.messages.rules_delete_rule_question'), t('kanbans.messages.rules_delete_rule_confirmation'), t('actions.yes'), t('actions.cancel')).then((r) => {
            if (r.isConfirmed) {
                kanbanUseCase.deleteColumnRuleByUUID(uuid).then((response) => {
                    if (response.error) {
                        popup.toast("error", t(`kanbans.errors.${response.error}`), 2000);
                    } else {
                        popup.toast("success", t(`kanbans.messages.${response.message}`) as string, 2000);
                    }
                    updateList(prev => !prev)
                });
            }
        });
    }

    const handleDeleteColumnAllowed = (uuid: string) => {
        popup.confirm("question", t(`kanbans.messages.allowed_column_delete_question`), t(`kanbans.messages.allowed_column_delete_confirmation`), t('actions.yes'), t('actions.cancel')).then((r) => {
            if (r.isConfirmed) {
                kanbanUseCase.deleteAllowedColumnUUID(props.uuid ?? "", uuid).then((response) => {
                    if (response.error) {
                        popup.toast("error", t(`kanbans.errors.${response.error}`), 2000);
                    } else {
                        popup.toast("success", t(`kanbans.messages.${response.message}`) as string, 2000);
                    }
                    updateList(prev => !prev)
                });
            }
        });
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
                    {t('kanbans.rules.actions.add_rule')}
                </Button>
                <Button
                    variant={"outlined"}
                    startDecorator={<SchemaRoundedIcon/>}
                    onClick={() => {
                        setFormType(CrmFormType.REGISTER_ALLOWED_COLUMN)
                        setColumnUUID(props.uuid ?? "")
                    }}
                >
                    {t('kanbans.rules.actions.allow_column')}
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
                        <Box
                            key={`column_rule_${rule.uuid}`}
                            sx={{
                                minWidth: "100%",
                                display: "flex",
                                gap: 1
                            }}
                        >
                            <Chip
                                variant={"outlined"}
                                color={"warning"}
                                sx={{
                                    pt: 0.5,
                                    pb: 0.5,
                                    borderRadius: theme.spacing(1),
                                    minWidth: `calc(100% - 40px - ${theme.spacing(1)})`
                                }}
                                onClick={() => {
                                    setFormType(CrmFormType.EDIT_RULE)
                                    setColumnUUID(props.uuid ?? "")
                                    setColumnRuleUUID(rule.uuid ?? "")
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
                            <Chip
                                size={"sm"}
                                variant={"outlined"}
                                color={"warning"}
                                sx={{
                                    pt: 0.5,
                                    pb: 0.5,
                                    borderRadius: theme.spacing(1),
                                    minWidth: "40px"
                                }}
                                onClick={() => {
                                    handleDeleteColumnRule(rule.uuid ?? "")
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <DeleteRoundedIcon/>
                                </div>
                            </Chip>
                        </Box>
                    ))}
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        mt: "auto",
                        width: "100%",
                        pt: 2
                    }}
                >
                    {props.allowedColumns && props.allowedColumns.filter(x => x !== props.uuid).map((allowed) => {
                        const column = board.columns?.find(c => c.uuid === allowed)

                        return (
                            <Box
                                key={`column_allowed_${allowed}`}
                                sx={{
                                    minWidth: "100%",
                                    display: "flex",
                                    gap: 1
                                }}
                            >
                                <Chip
                                    variant={"outlined"}
                                    color={"success"}
                                    sx={{
                                        pt: 0.5,
                                        pb: 0.5,
                                        borderRadius: theme.spacing(1),
                                        minWidth: `calc(100% - 40px - ${theme.spacing(1)})`
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
                                <Chip
                                    size={"sm"}
                                    variant={"outlined"}
                                    color={"success"}
                                    sx={{
                                        pt: 0.5,
                                        pb: 0.5,
                                        borderRadius: theme.spacing(1),
                                        minWidth: "40px"
                                    }}
                                    onClick={() => {
                                        handleDeleteColumnAllowed(column?.uuid ?? "")
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <DeleteRoundedIcon/>
                                    </div>
                                </Chip>
                            </Box>
                        )
                    })}
                </Box>
            </Box>
        </Box>
    )
}