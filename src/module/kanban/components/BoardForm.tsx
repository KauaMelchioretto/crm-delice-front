import {useAtom, useAtomValue, useSetAtom} from "jotai/index";
import CrmState from "../../../utils/state/CrmState.ts";
import {CrmFormType} from "../../../utils/entities/entities.ts";
import {CrmModal} from "../../../utils/components/core/CrmModal.tsx";
import {FieldValues, FormProvider, useForm} from "react-hook-form";
import {Box, Button, FormControl, FormHelperText, FormLabel, IconButton, Typography, Radio} from "@mui/joy";
import CloseRounded from "@mui/icons-material/CloseRounded";
import {CrmSelect} from "../../../utils/components/core/SelectInput.tsx";
import {TextInput} from "../../../utils/components/core/TextInput.tsx";
import {CrmTextarea} from "../../../utils/components/core/CrmTextarea.tsx";
import {CrmContainer} from "../../../utils/components/core/CrmContainer.tsx";
import {useTranslation} from "react-i18next";
import KanbanState from "../state/KanbanState.ts";
import {BoardStatus, Column, ColumnType, ReorderColumn, Tag} from "../entities/entities.ts";
import {Fragment, useEffect, useRef, useState} from "react";
import {kanbanUseCase} from "../usecase/kanbanUseCase.ts";
import {popup} from "../../../utils/alerts/Popup.ts";
import {CrmTable} from "../../../utils/components/core/CrmTable.tsx";
import DeleteOutlineRounded from "@mui/icons-material/DeleteOutlineRounded";
import {CrmTableContainer} from "../../../utils/components/core/CrmTableContainer.tsx";
import {CrmColorPicker} from "../../../utils/components/colorPicker/CrmColorPicker.tsx";
import {useTheme} from "@mui/material";
import SquareRoundedIcon from '@mui/icons-material/SquareRounded';
import ViewStreamRoundedIcon from '@mui/icons-material/ViewStreamRounded';
import {arrayMove, SortableContext, useSortable, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {closestCenter, DndContext, PointerSensor, useSensors, useSensor} from "@dnd-kit/core";
import {DragEndEvent} from "@dnd-kit/core/dist/types/events";

export const BoardForm = () => {
    const [formType, setFormType] = useAtom(CrmState.FormType);
    const boardUUID = useAtomValue(CrmState.EntityFormUUID);

    switch (formType) {
        case CrmFormType.EMPTY:
            return <></>;
        case CrmFormType.REGISTER_BOARD:
            return (
                <CrmModal
                    open={true}
                    onClose={() => setFormType(CrmFormType.EMPTY)}
                >
                    <BoardFormRegister/>
                </CrmModal>
            );
        case CrmFormType.EDIT_BOARD:
            return (
                <CrmModal
                    open={true}
                    onClose={() => setFormType(CrmFormType.EMPTY)}
                >
                    <BoardFormRegister boardUUID={boardUUID}/>
                </CrmModal>
            );
        case CrmFormType.EDIT_TAGS:
            return (
                <CrmModal
                    open={true}
                    onClose={() => setFormType(CrmFormType.EMPTY)}
                >
                    <TagBoardForm boardUUID={boardUUID}/>
                </CrmModal>
            );
        case CrmFormType.EDIT_COLUMNS:
            return (
                <CrmModal
                    open={true}
                    onClose={() => setFormType(CrmFormType.EMPTY)}
                >
                    <ColumnBoardForm boardUUID={boardUUID}/>
                </CrmModal>
            );
    }
}

const BoardFormRegister = ({boardUUID}: { boardUUID?: string }) => {
    const setFormType = useSetAtom(CrmState.FormType)
    const updateList = useSetAtom(KanbanState.UpdateAtom)
    const formMethods = useForm();
    const {t} = useTranslation();

    const {handleSubmit, register, formState: {errors}, setValue} = formMethods

    const handleSubmitBoard = handleSubmit((data: FieldValues) => {
        kanbanUseCase.saveBoard({
            uuid: boardUUID,
            code: data.code,
            title: data.title,
            status: data.status,
            description: data.description
        }).then((response) => {
            if (response.error) {
                popup.toast("error", response.error, 2000);
            } else {
                popup.toast("success", "Quadro cadastrado com sucesso", 2000);
                updateList(prev => !prev);
                setFormType(CrmFormType.EMPTY);
            }
        })
    })

    useEffect(() => {
        if (boardUUID) {
            kanbanUseCase.getBoardByUUID(boardUUID).then((response) => {
                if (response.board) {
                    const board = response.board

                    setValue("code", board.code)
                    setValue("status", board.status)
                    setValue("title", board.title)
                    setValue("description", board.description)
                }
            })
        }
    }, [boardUUID]);

    return (
        <CrmContainer>
            <FormProvider {...formMethods}>
                <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                >
                    <Typography level={"body-md"} fontWeight={"bold"}>
                        {boardUUID ? t("actions.edit") : t("actions.register")} {t("kanbans.title.boards")}
                    </Typography>
                    <IconButton
                        size={"sm"}
                        onClick={() => setFormType(CrmFormType.EMPTY)}
                    >
                        <CloseRounded/>
                    </IconButton>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                    }}
                    component={"form"}
                    onSubmit={handleSubmitBoard}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "start",
                            gap: 2
                        }}
                    >
                        <FormControl sx={{flex: 1}}>
                            <FormLabel>Código</FormLabel>
                            <TextInput
                                {...register("code", {required: "Código é obrigatório"})}
                                size={"sm"}
                                variant={"soft"}
                                disabled={!!boardUUID}
                            />
                            <FormHelperText sx={{minHeight: "1rem"}}>
                                {errors?.code?.message as string}
                            </FormHelperText>
                        </FormControl>
                        {
                            boardUUID && (
                                <FormControl sx={{flex: 1}}>
                                    <FormLabel>Status</FormLabel>
                                    <CrmSelect
                                        {...register("status", {required: "Situação é obrigatorio"})}
                                        size={"sm"}
                                        variant={"soft"}
                                        options={[
                                            {
                                                label: t("kanbans.status.board.active"),
                                                value: BoardStatus.ACTIVE
                                            },
                                            {
                                                label: t("kanbans.status.board.inactive"),
                                                value: BoardStatus.INACTIVE
                                            }
                                        ]}
                                    />
                                    <FormHelperText sx={{minHeight: "1rem"}}>
                                        {errors?.status?.message as string}
                                    </FormHelperText>
                                </FormControl>
                            )
                        }
                    </Box>
                    <FormControl sx={{flex: 1}}>
                        <FormLabel>Titulo</FormLabel>
                        <TextInput
                            {...register("title", {required: "Titulo é obrigatorio"})}
                            size={"sm"}
                            variant={"soft"}
                        />
                        <FormHelperText sx={{minHeight: "1rem"}}>
                            {errors?.name?.message as string}
                        </FormHelperText>
                    </FormControl>
                    <FormControl>
                        <FormLabel>{t("products.fields.description")}</FormLabel>
                        <CrmTextarea
                            {...register("description")}
                            size={"sm"}
                            variant={"soft"}
                            minRows={2}
                            maxRows={3}
                        />
                        <FormHelperText sx={{minHeight: "1rem"}}></FormHelperText>
                    </FormControl>
                    <Button
                        type={"submit"}
                        sx={{flex: 1}}
                    >
                        {boardUUID ? t("actions.save") : t("actions.register")}
                    </Button>
                </Box>
            </FormProvider>
        </CrmContainer>
    )
}

const TagBoardForm = ({boardUUID}: { boardUUID: string }) => {
    const setFormType = useSetAtom(CrmState.FormType)
    const formMethods = useForm();
    const {t} = useTranslation()

    const updateList = useSetAtom(KanbanState.UpdateAtom)

    const [tags, setTags] = useState<Tag[]>([])
    const [update, setUpdate] = useState(false)

    const {register, handleSubmit, formState: {errors}} = formMethods;

    const theme = useTheme()

    const colors: string[] = theme.palette.primary as unknown as string[]
    const defaultColor: string = colors[500]
    const colorRef = useRef<string>(defaultColor)

    const handleDeleteTag = (tagUUID: string) => {
        popup.confirm("question", "Delete tag?", "Are sure that want delete this tag?", "Yes").then((r) => {
            if (r.isConfirmed) {
                kanbanUseCase.deleteTagByUUID(tagUUID).then((response) => {
                    if (response.error) {
                        popup.toast("error", response.error, 2000);
                    } else {
                        popup.toast("success", response.message as string, 2000);
                    }
                    setUpdate(prev => !prev);

                    updateList(prev => !prev)
                });
            }
        });
    }

    const handleFormTag = handleSubmit((data: FieldValues) => {
        kanbanUseCase.saveTag({
            boardUUID: boardUUID,
            color: colorRef.current,
            description: data.description,
            title: data.title
        }).then((response) => {
            if (response.error) {
                popup.toast("error", response.error, 2000);
            } else {
                popup.toast("success", "The module is included with success", 2000);
                setUpdate(prev => !prev);

                updateList(prev => !prev)
                setFormType(CrmFormType.EMPTY);
            }
        })
    })

    useEffect(() => {
        if (boardUUID) {
            kanbanUseCase.getTagsByBoardUUID(boardUUID).then((response) => {
                if (response.tags) {
                    setTags(response.tags ?? [])
                }
            })
        }
    }, [boardUUID, update]);

    return (
        <CrmContainer>
            <FormProvider {...formMethods}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                    }}
                    component={"form"}
                    onSubmit={handleFormTag}
                >
                    <Box
                        display={"flex"}
                        justifyContent={"space-between"}
                        alignItems={"center"}
                    >
                        <Typography level={"body-md"} fontWeight={"bold"}>
                            {boardUUID ? t("actions.edit") : t("actions.register")} {t("kanbans.title.tags")}
                        </Typography>
                        <IconButton
                            size={"sm"}
                            onClick={() => setFormType(CrmFormType.EMPTY)}
                        >
                            <CloseRounded/>
                        </IconButton>
                    </Box>
                    <CrmTableContainer sx={{maxHeight: 150}}>
                        <CrmTable
                            sx={{
                                "& thead th:nth-child(1)": {
                                    width: 20
                                },
                                "& thead th:nth-child(2)": {
                                    width: 100
                                },
                                "& thead th:nth-child(3)": {
                                    width: 200
                                },
                                "& tbody td:nth-child(3)": {
                                    textWrap: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis"
                                },
                                "& thead th:nth-child(4)": {
                                    width: 50
                                },
                            }}
                        >
                            <thead>
                            <tr>
                                <th>Cor</th>
                                <th>Titulo</th>
                                <th>Descrição</th>
                                <th>Deletar</th>
                            </tr>
                            </thead>
                            <tbody>
                            {tags!.length > 0 ? tags?.map((tag: Tag) => (
                                <tr key={`role_list_key_${tag.uuid}`}>
                                    <td>
                                        <SquareRoundedIcon
                                            sx={{
                                                color: tag.color,
                                                fontSize: "20pt"
                                            }}
                                        />
                                    </td>
                                    <td>{tag.title}</td>
                                    <td>{tag.description}</td>
                                    <td>
                                        <IconButton
                                            size={"sm"}
                                            onClick={() => {
                                                handleDeleteTag(tag?.uuid ?? '')
                                            }}
                                        >
                                            <DeleteOutlineRounded/>
                                        </IconButton>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td
                                        colSpan={4}
                                        style={{
                                            textAlign: "center"
                                        }}
                                    >
                                        No tags for this board
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </CrmTable>
                    </CrmTableContainer>
                    <Box
                        sx={{
                            display: "flex",
                            mt: 1
                        }}
                    >
                        <Typography
                            level={"body-md"}
                            fontWeight={"bold"}
                        >
                            Incluir uma nova tag
                        </Typography>
                    </Box>
                    <FormControl>
                        <FormLabel>Titulo</FormLabel>
                        <TextInput
                            {...register("title", {required: "The title is required"})}
                            size={"md"}
                            variant={"soft"}
                        />
                        <FormHelperText sx={{minHeight: "1rem"}}>
                            {errors?.title?.message as string}
                        </FormHelperText>
                    </FormControl>
                    <FormControl>
                        <FormLabel>{t("products.fields.description")}</FormLabel>
                        <CrmTextarea
                            {...register("description")}
                            size={"sm"}
                            variant={"soft"}
                            minRows={2}
                            maxRows={3}
                        />
                        <FormHelperText sx={{minHeight: "1rem"}}></FormHelperText>
                    </FormControl>
                    <CrmColorPicker
                        initialColor={colorRef.current}
                        onChange={(color) => colorRef.current = color}
                    />
                    <Button type={"submit"}>{t("actions.save")}</Button>
                </Box>
            </FormProvider>
        </CrmContainer>
    )
}

const ColumnBoardForm = ({boardUUID}: { boardUUID: string }) => {
    const setFormType = useSetAtom(CrmState.FormType)
    const formMethods = useForm();
    const {t} = useTranslation()

    const updateList = useSetAtom(KanbanState.UpdateAtom)

    const [columns, setColumns] = useState<Column[]>([])
    const [update, setUpdate] = useState(false)

    const reorderRef = useRef<ReorderColumn[]>([])

    const {register, handleSubmit, formState: {errors}} = formMethods;

    const [registerForm, setRegisterForm] = useState<boolean>(false)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5
            }
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;

        if (active.id !== over?.id) {
            const oldIndex = columns.findIndex(
                (item) => item.uuid === active.id
            );
            const newIndex = columns.findIndex(
                (item) => item.uuid === over?.id
            );

            const temp = arrayMove(columns, oldIndex, newIndex)

            reorderRef.current = temp.map(
                (c, i) => ({uuid: c.uuid ?? "", index: i})
            );

            setColumns(temp)
        }
    };

    const handleFormColumn = handleSubmit((data: FieldValues) => {
        kanbanUseCase.saveColumn({
            boardUUID: boardUUID,
            description: data.description,
            title: data.title,
            code: data.code,
            type: data.type,
        }).then((response) => {
            if (response.error) {
                popup.toast("error", response.error, 2000);
            } else {
                popup.toast("success", "The module is included with success", 2000);
                setUpdate(prev => !prev);

                updateList(prev => !prev)
                setFormType(CrmFormType.EMPTY);
            }
        })
    })

    const handleChangeDefaultColumn = (columnUUID: string) => {
        kanbanUseCase.setDefaultColumn(boardUUID, columnUUID).then(response => {
            if (response.columns) {
                setColumns(response.columns)
            }
        })
    }

    useEffect(() => {
        if (boardUUID) {
            kanbanUseCase.getColumnsByBoardUUID(boardUUID).then((response) => {
                if (response.columns) {
                    setColumns(response.columns ?? [])
                }
            })
        }
    }, [boardUUID, update]);

    useEffect(() => {
        if (reorderRef.current.length > 0) {
            kanbanUseCase.reorderColumns(reorderRef.current).then((response) => {
                if (response.error) {
                    popup.toast("error", response.error, 2000)
                }

                updateList(prev => !prev)
            })
        }
    }, [reorderRef.current]);

    return (
        <CrmContainer>
            <FormProvider {...formMethods}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                    }}
                    component={"form"}
                    onSubmit={handleFormColumn}
                >
                    <Box
                        display={"flex"}
                        justifyContent={"space-between"}
                        alignItems={"center"}
                    >
                        <Typography level={"body-md"} fontWeight={"bold"}>
                            {boardUUID ? t("actions.edit") : t("actions.register")} {t("kanbans.title.columns")}
                        </Typography>
                        <IconButton
                            size={"sm"}
                            onClick={() => setFormType(CrmFormType.EMPTY)}
                        >
                            <CloseRounded/>
                        </IconButton>
                    </Box>
                    {!registerForm ? (
                        <Fragment>
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={columns.map((i) => ({
                                        id: i.uuid ?? ""
                                    }))}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <CrmTableContainer sx={{maxHeight: 500}}>
                                        <CrmTable
                                            sx={{
                                                "& thead th:nth-child(1)": {
                                                    width: 50
                                                },
                                                "& thead th:nth-child(2)": {
                                                    width: 100
                                                },
                                                "& thead th:nth-child(3)": {
                                                    width: 200
                                                },
                                                "& thead th:nth-child(4)": {
                                                    width: 50
                                                },
                                                "& thead th:nth-child(5)": {
                                                    width: 50
                                                },
                                                "& tbody td:nth-child(3)": {
                                                    textWrap: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis"
                                                },
                                            }}
                                        >
                                            <thead>
                                            <tr>
                                                <th>Ordem</th>
                                                <th>Titulo</th>
                                                <th>Descrição</th>
                                                <th>Padrão</th>
                                                <th>Deletar</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {columns!.length > 0 ? columns?.map((column: Column) => (
                                                <ColumnSortableRow
                                                    column={column}
                                                    callback={() => {
                                                        setUpdate(prev => !prev)
                                                        updateList(prev => !prev)
                                                    }}
                                                    onChangeDefaultColumn={handleChangeDefaultColumn}
                                                    key={`role_list_key_${column.uuid}`}
                                                />
                                            )) : (
                                                <tr>
                                                    <td
                                                        colSpan={4}
                                                        style={{
                                                            textAlign: "center"
                                                        }}
                                                    >
                                                        No tags for this board
                                                    </td>
                                                </tr>
                                            )}
                                            </tbody>
                                        </CrmTable>
                                    </CrmTableContainer>
                                </SortableContext>
                            </DndContext>
                            <Button
                                onClick={() => {
                                    setRegisterForm(true)
                                }}
                            >
                                Incluir uma nova coluna
                            </Button>
                        </Fragment>
                    ) : (
                        <Fragment>
                            <Box
                                display={"flex"}
                                alignItems={"center"}
                                gap={1}
                            >
                                <FormControl>
                                    <FormLabel>Código</FormLabel>
                                    <TextInput
                                        {...register("code", {required: "The code is required"})}
                                        size={"sm"}
                                        variant={"soft"}
                                    />
                                    <FormHelperText sx={{minHeight: "1rem"}}>
                                        {errors?.code?.message as string}
                                    </FormHelperText>
                                </FormControl>
                                <FormControl sx={{flex: 1}}>
                                    <FormLabel>Tipo</FormLabel>
                                    <CrmSelect
                                        {...register("type", {required: "The column type is required"})}
                                        size={"sm"}
                                        variant={"soft"}
                                        options={
                                            [
                                                {
                                                    value: ColumnType.NONE,
                                                    label: "Nenhum"
                                                },
                                                {
                                                    value: ColumnType.COUNTER,
                                                    label: "Contador"
                                                },
                                                {
                                                    value: ColumnType.VALUE,
                                                    label: "Somador"
                                                }
                                            ]
                                        }
                                    />
                                    <FormHelperText sx={{minHeight: "1rem"}}>
                                        {errors?.type?.message as string}
                                    </FormHelperText>
                                </FormControl>
                            </Box>
                            <FormControl>
                                <FormLabel>Titulo</FormLabel>
                                <TextInput
                                    {...register("title", {required: "The title is required"})}
                                    size={"md"}
                                    variant={"soft"}
                                />
                                <FormHelperText sx={{minHeight: "1rem"}}>
                                    {errors?.title?.message as string}
                                </FormHelperText>
                            </FormControl>
                            <FormControl>
                                <FormLabel>{t("products.fields.description")}</FormLabel>
                                <CrmTextarea
                                    {...register("description")}
                                    size={"sm"}
                                    variant={"soft"}
                                    minRows={2}
                                    maxRows={3}
                                />
                                <FormHelperText sx={{minHeight: "1rem"}}></FormHelperText>
                            </FormControl>
                            <Box display={"flex"} flexDirection={"row"} gap={1}>
                                <Button
                                    sx={{
                                        flex: 1
                                    }}
                                    onClick={() => {
                                        setRegisterForm(false)
                                    }}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    sx={{
                                        flex: 1
                                    }}
                                    type={"submit"}
                                >
                                    Salvar
                                </Button>
                            </Box>
                        </Fragment>
                    )}
                </Box>
            </FormProvider>
        </CrmContainer>
    )
}

const ColumnSortableRow = (
    {column, callback, onChangeDefaultColumn}: {
        column: Column,
        callback: () => void
        onChangeDefaultColumn: (uuid: string) => void
    }
) => {
    const {attributes, listeners, setNodeRef, transform, transition} = useSortable(
        {id: column.uuid ?? ""}
    );

    const theme = useTheme()

    const tempBackground = theme.palette.background as unknown as { body: string }

    const style = {
        transform: transform ? `translate(0px, ${transform.y}px)` : undefined,
        transition,
        background: tempBackground.body
    };

    const handleDeleteTag = (columnUUID: string) => {
        popup.confirm("question", "Delete Column?", "Are sure that want delete this column?", "Yes").then((r) => {
            if (r.isConfirmed) {
                kanbanUseCase.deleteColumnByUUID(columnUUID).then((response) => {
                    if (response.error) {
                        popup.toast("error", response.error, 2000);
                    } else {
                        popup.toast("success", response.message as string, 2000);
                    }
                    callback()
                });
            }
        });
    }

    return (
        <tr ref={setNodeRef} style={style}>
            <td {...attributes} {...listeners}>
                <ViewStreamRoundedIcon
                    sx={{
                        cursor: "pointer",
                        fontSize: "15pt"
                    }}
                />
            </td>
            <td>{column.title}</td>
            <td>{column.description}</td>
            <td>
                <Radio
                    checked={column.isDefault}
                    onChange={() => onChangeDefaultColumn(column.uuid ?? '')}
                    value="b"
                    name="radio-buttons"
                />
            </td>
            <td>
                <IconButton
                    size={"sm"}
                    onClick={() => {
                        handleDeleteTag(column?.uuid ?? '')
                    }}
                >
                    <DeleteOutlineRounded/>
                </IconButton>
            </td>
        </tr>
    )
}