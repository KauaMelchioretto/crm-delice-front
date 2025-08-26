import {Avatar, Box, Dropdown, MenuButton, Menu as MenuJoy, MenuItem, Stack, Typography} from "@mui/joy";
import {StoreRounded, SvgIconComponent} from "@mui/icons-material";
import {ToggleThemeButton} from "../../theme/ToggleThemeMode.tsx";
import {ToggleLanguageButton} from "../../../../i18n/components/ToggleLanguageButton.tsx";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../../../core/auth/provider/AuthProvider.tsx";
import {TextInput} from "../../core/TextInput.tsx";
import {SetStateAction, useAtom, useAtomValue, useSetAtom} from "jotai";
import AppBarState from "../state/AppBarState.ts";
import {Dispatch, memo, useRef, useState} from "react";
import {Menu} from "../entities/entities.ts";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import {CrmFormType} from "../../../entities/entities.ts";
import CrmState from "../../../state/CrmState.ts";
import {useTranslation} from "react-i18next";
import {useApp} from "../../../../core/config/app/AppProvider.tsx";
import {Notifications} from "./Notifications.tsx";

export const CrmAppBar = () => {
    const {user} = useAuth()
    const navigate = useNavigate()

    useAtomValue(AppBarState.NotificationAtomEffect)

    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}
        >
            <Stack direction={"row"} alignItems={"center"} gap={1}>
                <StoreRounded color={"action"} sx={{fontSize: "15pt"}}/>
                <Typography level={"title-md"} color={"neutral"}>
                    Delice CRM
                </Typography>
            </Stack>
            <MenuAppBar/>
            <Stack direction={"row"} alignItems={"center"} gap={1}>
                <Notifications/>
                <ToggleThemeButton/>
                <ToggleLanguageButton/>
                <Avatar
                    variant="outlined"
                    size="sm"
                    alt={user?.name.substring(0, 1)}
                    src={user?.avatar}
                    sx={{
                        cursor: "pointer"
                    }}
                    onClick={() => {
                        navigate("/me")
                    }}
                />
            </Stack>
        </Box>
    )
}

const MenuAppBar = () => {
    const [onInput, setOnInput] = useState<boolean>(false);
    const menuResultAtom = useAtomValue(AppBarState.SearchResultAtom)

    const navigate = useNavigate()

    const {crmModules} = useApp()

    const anchorEl = useRef(null)

    const modifiedFormType = useSetAtom(CrmState.FormType)
    const modifiedEntityUUID = useSetAtom(CrmState.EntityFormUUID)

    const defaultMenuResult = {
        totalResults: 0,
    } as Menu

    const menuResult: Menu = menuResultAtom.state === "hasData"
        ? (menuResultAtom.data?.menu ?? defaultMenuResult)
        : defaultMenuResult

    return (
        <Dropdown>
            <Stack direction={"row"} alignItems={"center"} gap={1} ref={anchorEl}>
                <SearchBarInput setOnInput={setOnInput}/>
                <CreateButton/>
            </Stack>
            <MenuJoy
                anchorEl={anchorEl.current}
                open={onInput && menuResult.totalResults > 0}
                sx={{
                    p: 1
                }}
            >
                <Box
                    sx={{
                        overflowY: "auto",
                        maxHeight: "500px",
                        width: "700px"
                    }}
                >
                    {(onInput && menuResult.totalResults > 0) &&
                        menuResult.result?.map((m, i) => {
                            const module = crmModules.find(x => x.code === m.type)

                            if (!module) return

                            const Icon = module.icon as SvgIconComponent

                            return (
                                <Box key={`module_app_bar_${i}`}>
                                    <Stack
                                        direction={"row"}
                                        alignItems={"center"}
                                        gap={1}
                                        onClick={() => navigate(module.path)}
                                        sx={{
                                            ":hover": {
                                                backgroundColor: "var(--TableRow-hoverBackground, var(--joy-palette-background-level3))",
                                                cursor: "pointer"
                                            },
                                            p: 0.5,
                                            borderRadius: 5
                                        }}
                                    >
                                        <Icon/>
                                        <Typography level="title-sm">
                                            {module.label}
                                        </Typography>
                                    </Stack>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 0.8,
                                        }}
                                    >
                                        {
                                            m.values?.map((v, iv) => {
                                                return (
                                                    <Stack
                                                        key={`module_app_bar_value_${iv}`}
                                                        direction={"row"}
                                                        alignItems={"center"}
                                                        gap={1}
                                                        sx={{
                                                            ":hover": {
                                                                backgroundColor: "var(--TableRow-hoverBackground, var(--joy-palette-background-level3))",
                                                                cursor: "pointer"
                                                            },
                                                            p: 0.5,
                                                            borderRadius: 5
                                                        }}
                                                        onClick={() => {
                                                            modifiedFormType(module.editFormType as CrmFormType)
                                                            modifiedEntityUUID(v.uuid)
                                                        }}
                                                    >
                                                        <Typography level="body-sm">
                                                            {v.value}
                                                        </Typography>
                                                    </Stack>
                                                )
                                            })
                                        }
                                    </Box>
                                </Box>
                            )
                        })
                    }
                </Box>
            </MenuJoy>
        </Dropdown>
    )
}

const SearchBarInput = memo(({setOnInput}: { setOnInput: Dispatch<SetStateAction<boolean>> }) => {
    const setSearchValue = useSetAtom(AppBarState.SearchValueAtom)

    const [searchBarValue, setSearchBarValue] = useAtom(AppBarState.SearchBarValueAtom)

    const {t} = useTranslation();

    return (
        <TextInput
            size={"sm"}
            onChange={(evt) => {
                setSearchValue(evt.target.value)
                setSearchBarValue(evt.target.value)
            }}
            value={searchBarValue}
            onFocus={() => {
                setOnInput(true)
            }}
            onBlur={() => {
                setTimeout(() => {
                    setOnInput(false)
                }, 200)
            }}
            placeholder={t("app_bar.placeholder")}
            endDecorator={<SearchRoundedIcon/>}
            sx={{
                width: {
                    xl: "700px",
                    lg: "500px",
                    md: "300px",
                    sm: "300px",
                    xs: "100px",
                }
            }}
        />
    )
})

const CreateButton = () => {
    const setFormType = useSetAtom(CrmState.FormType)

    const {t} = useTranslation();

    const {modules} = useAuth()
    const {crmModules} = useApp()

    const createModules = crmModules.filter(x => {
        if (modules?.find(m => m.code === x.code) && x.createFormType !== undefined) {
            return x
        }
    });

    return (
        <Dropdown>
            <MenuButton
                size={"sm"}
                variant={"solid"}
                color={"primary"}
                endDecorator={<AddRoundedIcon/>}
            >
                {t("actions.register")}
            </MenuButton>
            <MenuJoy>
                {
                    createModules.map((x) => {
                        const Icon = x.icon as SvgIconComponent

                        return (
                            <MenuItem
                                onClick={() => {
                                    setFormType(x.createFormType as CrmFormType)
                                }}
                            >
                                <Icon/>
                                {x.createLabel}
                            </MenuItem>
                        )
                    })
                }
            </MenuJoy>
        </Dropdown>
    )
}