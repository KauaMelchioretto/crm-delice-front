import {Avatar, Box, Divider, IconButton, Typography} from "@mui/joy";
import {CrmTitleContainer} from "../../../utils/components/core/CrmTitleContainer.tsx";
import {CrmContainer} from "../../../utils/components/core/CrmContainer.tsx";
import {useAuth} from "../provider/AuthProvider.tsx";
import {maskCPF} from "../../../utils/functions/DocumentValidation.ts";
import {maskZipCode} from "../../../utils/functions/MaskZipCode.ts";
import dayjs from "dayjs";
import {Fragment} from "react";
import LaunchRounded from '@mui/icons-material/LaunchRounded';
import {useNavigate} from "react-router-dom";
import PlaylistRemoveRounded from '@mui/icons-material/PlaylistRemoveRounded';
import {useTranslation} from "react-i18next";
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded';
import {useSetAtom} from "jotai";
import CrmState from "../../../utils/state/CrmState.ts";
import {CrmFormType} from "../../../utils/entities/entities.ts";

export const Me = () => {
    const {user, modules} = useAuth()
    const navigate = useNavigate()
    const {t} = useTranslation();

    const setFormType = useSetAtom(CrmState.FormType)

    const fullName = user?.name + " " + user?.surname

    return (
        <Box
            sx={{
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
                    alignItems: "center",
                }}
            >
                <Typography
                    level={"body-lg"}
                    fontWeight={"bold"}
                >
                    {t("me.title")}
                </Typography>
            </CrmTitleContainer>
            <Box
                display={"flex"}
                gap={1}
                sx={{
                    width: "100%",
                    flexDirection: {
                        xl: "row",
                        lg: "row",
                        md: "row",
                        sm: "column",
                        xs: "column"
                    }
                }}
            >
                <CrmContainer
                    sx={{
                        width: {
                            xl: "50%",
                            lg: "50%",
                            md: "50%",
                            sm: "100%",
                            xs: "100%"
                        },
                        display: "flex",
                        flexDirection: "column",
                        gap: 2
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 2
                        }}
                    >
                        <Avatar
                            variant="outlined"
                            size="lg"
                            alt={user?.name[0] ?? ""}
                            src={user?.avatar}
                            sx={{
                                height: "7rem",
                                width: "7rem"
                            }}
                        />
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                height: "100%",
                                width: "100%"
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                <Typography
                                    level={"body-lg"}
                                    fontWeight={"bold"}
                                >
                                    {fullName}
                                </Typography>
                                <Typography
                                    level={"body-sm"}
                                    fontWeight={"bold"}
                                >
                                    {user?.email}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                <IconButton
                                    onClick={() => setFormType(CrmFormType.EDIT_MY_USER)}
                                >
                                    <ManageAccountsRoundedIcon/>
                                </IconButton>
                            </Box>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "start",
                            height: "100%",
                            gap: 0.5
                        }}
                    >
                        <Divider>{t("me.sections.personal_informations")}</Divider>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between"
                            }}
                        >
                            <Typography
                                level={"body-sm"}
                                fontWeight={"bold"}
                            >
                                {t("users.fields.document")}
                            </Typography>
                            <Typography
                                level={"body-sm"}
                                fontWeight={"bold"}
                            >
                                {maskCPF(user?.document ?? "")}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between"
                            }}
                        >
                            <Typography
                                level={"body-sm"}
                                fontWeight={"bold"}
                            >
                                {t("users.fields.address")}
                            </Typography>
                            <Typography
                                level={"body-sm"}
                                fontWeight={"bold"}
                            >
                                {
                                    maskZipCode(user?.zipCode ?? "") +
                                    " " +
                                    (user?.address ?? "") +
                                    " - " +
                                    (user?.city ?? "") +
                                    " " +
                                    (user?.state ?? "")
                                }
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between"
                            }}
                        >
                            <Typography
                                level={"body-sm"}
                                fontWeight={"bold"}
                            >
                                {t("users.fields.date_of_birth")}
                            </Typography>
                            <Typography
                                level={"body-sm"}
                                fontWeight={"bold"}
                            >
                                {dayjs(user?.dateOfBirth).format("DD/MM/YYYY")}
                            </Typography>
                        </Box>
                        <Divider sx={{mt: 5}}>{t("me.sections.user_informations")}</Divider>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <Typography
                                level={"body-sm"}
                                fontWeight={"bold"}
                            >
                                {t("me.fields.access_login")}
                            </Typography>
                            <Typography
                                level={"body-sm"}
                                fontWeight={"bold"}
                            >
                                {user?.login}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <Typography
                                level={"body-sm"}
                                fontWeight={"bold"}
                            >
                                {t("me.fields.user_type")}
                            </Typography>
                            <Typography
                                level={"body-sm"}
                                fontWeight={"bold"}
                            >
                                {user?.userType}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <Typography
                                level={"body-sm"}
                                fontWeight={"bold"}
                            >
                                {t("me.fields.last_change")}
                            </Typography>
                            <Typography
                                level={"body-sm"}
                                fontWeight={"bold"}
                            >
                                {dayjs(user?.modifiedAt).format("DD/MM/YYYY")}
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between"
                            }}
                        >
                            <Typography
                                level={"body-sm"}
                                fontWeight={"bold"}
                            >
                                {t("me.fields.creation")}
                            </Typography>
                            <Typography
                                level={"body-sm"}
                                fontWeight={"bold"}
                            >
                                {dayjs(user?.createdAt).format("DD/MM/YYYY")}
                            </Typography>
                        </Box>
                    </Box>
                </CrmContainer>
                <CrmContainer
                    sx={{
                        width: {
                            xl: "50%",
                            lg: "50%",
                            md: "50%",
                            sm: "100%",
                            xs: "100%"
                        },
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        maxHeight: "500px",
                        overflowY: "auto"
                    }}
                >
                    <Typography
                        level={"body-lg"}
                        fontWeight={"bold"}
                    >
                        {t("me.sections.permissions")}
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1
                        }}
                    >
                        {modules?.length === 0 && (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    gap: 1,
                                    alignItems: "center"
                                }}
                            >
                                <PlaylistRemoveRounded sx={{fontSize: "20pt"}}/>
                                <Typography
                                    level={"body-md"}
                                    fontWeight={"bold"}
                                >
                                    {t("me.messages.user_without_permissions")}
                                </Typography>
                            </Box>
                        )}
                        {
                            modules?.map((m, i) => (
                                <Fragment key={`module_permission_${i}`}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "row",
                                            gap: 1,
                                            alignItems: "center"
                                        }}
                                    >
                                        <Typography
                                            level={"body-md"}
                                            fontWeight={"bold"}
                                        >
                                            {m?.label ?? ""}
                                        </Typography>
                                        <IconButton
                                            size={"sm"}
                                            onClick={() => navigate(m?.path ?? "")}
                                        >
                                            <LaunchRounded sx={{fontSize: "12pt"}}/>
                                        </IconButton>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                        }}
                                    >
                                        {
                                            m.roles?.map((r, ir) => (
                                                <Typography
                                                    key={`module_role_permission_${ir}`}
                                                >
                                                    {r?.label ?? ""}
                                                </Typography>
                                            ))
                                        }
                                    </Box>
                                </Fragment>
                            ))
                        }
                    </Box>
                </CrmContainer>
            </Box>
        </Box>
    )
}