import {Avatar, Box, Button, Stack, Typography} from "@mui/joy";
import {StoreRounded} from "@mui/icons-material";
import {ToggleThemeButton} from "../../theme/ToggleThemeMode.tsx";
import {ToggleLanguageButton} from "../../../../i18n/components/ToggleLanguageButton.tsx";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../../../core/auth/provider/AuthProvider.tsx";
import {TextInput} from "../../core/TextInput.tsx";
import {useAtomValue, useSetAtom} from "jotai";
import AppBarState from "../state/AppBarState.ts";
import {useState} from "react";
import {Menu, MenuOptionType} from "../entities/entities.ts";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import WalletRoundedIcon from "@mui/icons-material/WalletRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import {CrmFormType} from "../../../entities/entities.ts";
import CrmState from "../../../state/CrmState.ts";

export const CrmAppBar = () => {
    const {user} = useAuth()
    const navigate = useNavigate()

    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                position: "relative"
            }}
        >
            <Stack direction={"row"} alignItems={"center"} gap={1}>
                <StoreRounded color={"action"}/>
                <Typography level={"title-md"} color={"neutral"}>
                    Delice CRM
                </Typography>
            </Stack>
            <MenuAppBar/>
            <Stack direction={"row"} alignItems={"center"} gap={1}>
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
    const setSearchValue = useSetAtom(AppBarState.SearchValueAtom)

    const [onInput, setOnInput] = useState<boolean>(false);
    const menuResultAtom = useAtomValue(AppBarState.SearchResultAtom)

    const navigate = useNavigate()

    const modifiedFormType = useSetAtom(CrmState.FormType)
    const modifiedEntityUUID = useSetAtom(CrmState.EntityFormUUID)

    const defaultMenuResult = {
        totalResults: 0,
    } as Menu

    const menuResult: Menu = menuResultAtom.state === "hasData"
        ? (menuResultAtom.data?.menu ?? defaultMenuResult)
        : defaultMenuResult

    const modulesIcons = {
        [MenuOptionType.User]: {
            icon: AccountCircleRoundedIcon,
            label: "Usuários",
            path: "/user",
            formType: CrmFormType.EDIT_USER,
        },
        [MenuOptionType.Customer]: {
            icon: PeopleAltRoundedIcon,
            label: "Clientes",
            path: "/customers",
            formType: CrmFormType.EDIT_CUSTOMER,
        },
        [MenuOptionType.Wallet]: {
            icon: WalletRoundedIcon,
            label: "Carteiras",
            path: "/wallets",
            formType: CrmFormType.EDIT_WALLET,
        },
        [MenuOptionType.Product]: {
            icon: CategoryRoundedIcon,
            label: "Produtos",
            path: "/products",
            formType: CrmFormType.EDIT_PRODUCT,
        }
    }

    return (
        <Box
            sx={{
                position: "relative",
            }}
        >
            <Stack direction={"row"} alignItems={"center"} gap={1}>
                <TextInput
                    size={"sm"}
                    onChange={(evt) => setSearchValue(evt.target.value)}
                    onFocus={() => {
                        setOnInput(true)
                    }}
                    onBlur={() => {
                        setTimeout(() => {
                            setOnInput(false)
                        }, 200)
                    }}
                    placeholder={"Procurar..."}
                    endDecorator={<SearchRoundedIcon/>}
                    sx={{
                        width: "400px"
                    }}
                />
                <Button
                    size={"sm"}
                    endDecorator={<AddRoundedIcon/>}
                >
                    Criar
                </Button>
            </Stack>
            {(onInput && menuResult.totalResults > 0) && (
                <Box
                    sx={{
                        mt: 1.5,
                        backgroundColor: "background.surface",
                        maxHeight: "500px",
                        width: "550px",
                        position: "absolute",
                        border: "1px solid",
                        borderColor: "divider",
                        boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
                        borderRadius: "5px",
                        p: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5,
                        overflowY: "auto",
                        left: "50%",
                        transform: "translate(-50%, 0%)"
                    }}
                >
                    {
                        menuResult.result?.map((m, i) => {
                            const module = modulesIcons[m.type]

                            const Icon = module.icon

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
                                                            modifiedFormType(module.formType)
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
            )}
        </Box>
    )
}