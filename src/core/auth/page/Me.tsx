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

export const Me = () => {
    const {user, modules} = useAuth()
    const navigate = useNavigate()

    const fullName = user?.name + " " + user?.surname

    return (
        <Box
            sx={{
                width: "100%",
                height: "100%",
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
                    Minhas informações
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
                                flexDirection: "column",
                                justifyContent: "start",
                                height: "100%"
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
                        <Divider>Informações pessoais</Divider>
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
                                CPF
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
                                Endereço
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
                                Data de nascimento
                            </Typography>
                            <Typography
                                level={"body-sm"}
                                fontWeight={"bold"}
                            >
                                {dayjs(user?.dateOfBirth).format("DD/MM/YYYY")}
                            </Typography>
                        </Box>
                        <Divider sx={{mt: 5}}>Informações do usuário</Divider>
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
                                Login de acesso
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
                                Tipo de usuário
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
                                Ultima alteração
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
                                Criação
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
                        gap: 2
                    }}
                >
                    <Typography
                        level={"body-lg"}
                        fontWeight={"bold"}
                    >
                        Permissões
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
                                    Usuário sem permissões
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