import {CircularProgress, IconButton} from "@mui/joy";
import {CrmTable} from "../../../utils/components/core/CrmTable";
import {User, UsersFormType} from "../entities/entities.ts";
import EditRounded from "@mui/icons-material/EditRounded";
import {CrmTableContainer} from "../../../utils/components/core/CrmTableContainer";
import {useAtom, useAtomValue, useSetAtom} from "jotai";
import {CrmContainer} from "../../../utils/components/core/CrmContainer";
import UserState from "../state/UserState";
import {maskCPF} from "../../../utils/functions/DocumentValidation.ts";
import Rule from "@mui/icons-material/Rule";
import {useAuth} from "../../../core/auth/provider/AuthProvider.tsx";
import {maskPhone} from "../../../utils/functions/MaskPhone.ts";
import {ChangeEvent} from "react";

import {CrmPagination} from "../../../utils/components/pagination/CrmPagination.tsx";
import {useTranslation} from "react-i18next";

export const UsersList = () => {
    const {t} = useTranslation();

    const modifiedUser = useSetAtom(UserState.UserFormUUIDAtom);
    const modifiedUserForm = useSetAtom(UserState.UserFormTypeAtom);
    const usersAtom = useAtomValue(UserState.UsersListAtom);

    const {modules: userModules} = useAuth();

    const systemRoles = userModules?.find((x) => x.code === "USER_MODULE");
    const userModulesRoles = systemRoles?.roles?.map((x) => x.code);

    let users: User[] = [];

    if (usersAtom.state === "loading") {
        return (
            <CrmContainer sx={{width: "100%"}}>
                <CrmTableContainer sx={{height: 500, display: "flex", alignItems: "center", justifyContent: "center"}}>
                    <CircularProgress/>
                </CrmTableContainer>
            </CrmContainer>
        );
    }

    if (usersAtom.state === "hasData") {
        users = usersAtom.data.items ?? [];
    }

    return (
        <CrmContainer>
            <CrmTableContainer sx={{height: 500}}>
                <CrmTable
                    sx={{
                        "& thead th:nth-child(1)": {
                            width: 100,
                        },
                        "& thead th:nth-child(2)": {
                            width: 200,
                        },
                        "& thead th:nth-child(3)": {
                            width: 200,
                        },
                        "& thead th:nth-child(4)": {
                            width: 200,
                        },
                        "& thead th:nth-child(5)": {
                            width: 200,
                        },
                        "& thead th:nth-child(6)": {
                            width: 200,
                        },
                        "& thead th:nth-child(7)": {
                            width: 50,
                        },
                        "& thead th:nth-child(8)": {
                            width: 50,
                        },
                        "& thead th:nth-child(9)": {
                            width: 50,
                        },
                    }}
                >
                    <thead>
                    <tr>
                        <th>{t('users_table.user')}</th>
                        <th>{t('users_table.name')}</th>
                        <th>{t('users_table.email')}</th>
                        <th>{t('users_table.document')}</th>
                        <th>{t('users_table.phone')}</th>
                        <th>{t('users_table.state')}</th>
                        <th>{t('users_table.city')}</th>
                        <th>{t('users_table.edit')}</th>
                        <th>{t('users_table.roles')}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user: User) => (
                        <tr key={`user_list_key_${user.uuid}`}>
                            <td>{user.login}</td>
                            <td>
                                {user.name} {user.surname}
                            </td>
                            <td>{user.email}</td>
                            <td>{maskCPF(user.document)}</td>
                            <td>{maskPhone(user.phone ?? "")}</td>
                            <td>{user.state}</td>
                            <td>{user.city}</td>
                            <td>
                                <IconButton
                                    size={"sm"}
                                    onClick={() => {
                                        modifiedUser(user?.uuid ?? "");
                                        modifiedUserForm(UsersFormType.EDIT_USER);
                                    }}
                                >
                                    <EditRounded/>
                                </IconButton>
                            </td>
                            <td>
                                <IconButton
                                    size={"sm"}
                                    onClick={() => {
                                        modifiedUser(user?.uuid ?? "");
                                        modifiedUserForm(UsersFormType.ATTACH_ROLE);
                                    }}
                                    disabled={
                                        !(userModulesRoles?.includes("ATTACH_ROLES") ?? false)
                                    }
                                >
                                    <Rule/>
                                </IconButton>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </CrmTable>
            </CrmTableContainer>
            <UserPagination/>
        </CrmContainer>
    );
};

export const UserPagination = () => {
    const [page, setPage] = useAtom(UserState.UserListPage);
    const pageCount = useAtomValue(UserState.UserListTotalCountAtom);

    const handleChange = (_: ChangeEvent<unknown>, value: number) => {
        setPage(--value);
    };

    if (pageCount.state === "loading") return;

    const count = pageCount.state === "hasData" ? pageCount.data : 0;

    return (
        <CrmPagination page={page + 1} count={count} onChange={handleChange}/>
    );
}

