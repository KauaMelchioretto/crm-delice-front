import {CircularProgress, IconButton} from "@mui/joy";
import {CrmTable} from "../../../utils/components/core/CrmTable";
import {getUserStatusProps, User, UserStatus, UserType} from "../entities/entities.ts";
import EditRounded from "@mui/icons-material/EditRounded";
import {CrmTableContainer} from "../../../utils/components/core/CrmTableContainer";
import {useAtomValue, useSetAtom} from "jotai";
import {CrmContainer} from "../../../utils/components/core/CrmContainer";
import UserState from "../state/UserState";
import {maskCPF} from "../../../utils/functions/DocumentValidation.ts";
import Rule from "@mui/icons-material/Rule";
import {useAuth} from "../../../core/auth/provider/AuthProvider.tsx";
import {maskPhone} from "../../../utils/functions/MaskPhone.ts";
import {useTranslation} from "react-i18next";
import {FilterComponent} from "../../../utils/components/filter/FilterComponent.tsx";
import CrmState from "../../../utils/state/CrmState.ts";
import {CrmDefaultRoles, CrmField, CrmFormType, CrmModules} from "../../../utils/entities/entities.ts";
import {CrmTableHead} from "../../../utils/components/core/CrmTableHead.tsx";
import {CrmError} from "../../../utils/components/core/CrmError.tsx";
import {CrmCardStatus} from "../../../utils/components/core/CrmCardStatus.tsx";
import {CrmPaginationAtom} from "../../../utils/components/pagination/CrmPagination.tsx";

export const UsersList = () => {
    const {t} = useTranslation();

    const modifiedUser = useSetAtom(CrmState.EntityFormUUID);
    const modifiedUserForm = useSetAtom(CrmState.FormType);
    const usersAtom = useAtomValue(UserState.ListAtom);

    const {getRolesByModule} = useAuth();

    const roles = getRolesByModule(CrmModules.User);

    const canCreate = roles.filter(
        (x) => x.code === CrmDefaultRoles.CREATE_USER || x.code === CrmDefaultRoles.ALL_USER
    ).length > 0;

    const canAttachRoles = roles.filter(
        (x) => x.code === CrmDefaultRoles.ATTACH_ROLES || x.code === CrmDefaultRoles.ALL_USER
    ).length > 0;

    const userFields: CrmField[] = [
        {
            key: "login",
            label: t("users.fields.user"),
            sortable: true,
            filterable: true
        },
        {
            key: "name",
            label: t("users.fields.name"),
            sortable: true,
            filterable: true
        },
        {
            key: "user_type",
            label: t("users.fields.user_type"),
            sortable: true,
            filterable: true,
            filterOptions: [
                {
                    value: UserType.EMPLOYEE,
                    label: t(`users.fields.user_type_enum.${UserType.EMPLOYEE}`)
                },
                {
                    value: UserType.OWNER,
                    label: t(`users.fields.user_type_enum.${UserType.OWNER}`)
                },
                {
                    value: UserType.DEV,
                    label: t(`users.fields.user_type_enum.${UserType.DEV}`)
                }
            ],
        },
        {
            key: "email",
            label: t("users.fields.email"),
            sortable: true,
            filterable: true
        },
        {
            key: "document",
            label: t("users.fields.document"),
            sortable: true,
            filterable: true
        },
        {
            key: "phone",
            label: t("users.fields.phone"),
            sortable: true,
            filterable: true
        },
        {
            key: "state",
            label: t("users.fields.state"),
            sortable: true,
            filterable: true
        },
        {
            key: "city",
            label: t("users.fields.city"),
            sortable: true,
            filterable: true
        },
        {
            key: "status",
            label: t("users.fields.status.label"),
            sortable: true,
            filterable: true,
            filterOptions: [
                {
                    value: UserStatus.INACTIVE.toString(),
                    label: t(`users.fields.status.inactive`)
                },
                {
                    value: UserStatus.ACTIVE.toString(),
                    label: t(`users.fields.status.active`)
                },
                {
                    value: UserStatus.FIRST_ACCESS.toString(),
                    label: t(`users.fields.status.first_access`)
                }
            ]
        },
        {
            key: "edit",
            label: t("actions.edit")
        },
        {
            key: "roles",
            label: t("actions.roles")
        }
    ]

    switch (usersAtom.state) {
        case "hasError":
            return (
                <CrmContainer
                    sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%"
                    }}
                >
                    <CrmError/>
                </CrmContainer>
            );
        case "loading":
            return (
                <CrmContainer
                    sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%"
                    }}
                >
                    <CircularProgress/>
                </CrmContainer>
            );
        case "hasData":
            return (
                <CrmContainer
                    sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        gap: 1
                    }}
                >
                    <FilterComponent
                        fields={userFields}
                        filterAtom={UserState.FilterAtom}
                    />
                    <CrmTableContainer>
                        <CrmTable
                            sx={{
                                "& thead th:nth-child(1)": {
                                    width: 100,
                                },
                                "& thead th:nth-child(2)": {
                                    width: 250,
                                },
                                "& thead th:nth-child(3)": {
                                    width: 125,
                                },
                                "& thead th:nth-child(4)": {
                                    width: 250,
                                },
                                "& thead th:nth-child(5)": {
                                    width: 120,
                                },
                                "& thead th:nth-child(6)": {
                                    width: 150,
                                },
                                "& thead th:nth-child(7)": {
                                    width: 100,
                                },
                                "& thead th:nth-child(8)": {
                                    width: 100,
                                },
                                "& thead th:nth-child(9)": {
                                    width: 150,
                                },
                                "& thead th:nth-child(10)": {
                                    width: 50,
                                },
                                "& thead th:nth-child(11)": {
                                    width: 50,
                                },
                            }}
                        >
                            <CrmTableHead
                                fields={userFields}
                                orderByAtom={UserState.OrderByAtom}
                            />
                            <tbody>
                            {usersAtom.data.items?.map((user: User) => (
                                <tr key={`user_list_key_${user.uuid}`}>
                                    <td>{user.login}</td>
                                    <td>
                                        {user.name} {user.surname}
                                    </td>
                                    <td>{t(`users.fields.user_type_enum.${user.userType}`)}</td>
                                    <td>{user.email}</td>
                                    <td>{maskCPF(user.document)}</td>
                                    <td>{maskPhone(user.phone ?? "")}</td>
                                    <td>{user.state}</td>
                                    <td>{user.city}</td>
                                    <td>
                                        <CrmCardStatus {...getUserStatusProps(user.status!)} />
                                    </td>
                                    {canCreate && (
                                        <td>
                                            <IconButton
                                                size={"sm"}
                                                onClick={() => {
                                                    modifiedUser(user?.uuid ?? "");
                                                    modifiedUserForm(CrmFormType.EDIT_USER);
                                                }}
                                            >
                                                <EditRounded/>
                                            </IconButton>
                                        </td>
                                    )}
                                    {canAttachRoles && (
                                        <td>
                                            <IconButton
                                                size={"sm"}
                                                onClick={() => {
                                                    modifiedUser(user?.uuid ?? "");
                                                    modifiedUserForm(CrmFormType.ATTACH_ROLE);
                                                }}
                                            >
                                                <Rule/>
                                            </IconButton>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            </tbody>
                        </CrmTable>
                    </CrmTableContainer>
                    <CrmPaginationAtom
                        page={UserState.PageAtom}
                        count={UserState.ListTotalCountAtom}
                    />
                </CrmContainer>
            )
    }
};