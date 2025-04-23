import { CircularProgress, IconButton } from "@mui/joy";
import { CrmTable } from "../../../utils/components/core/CrmTable";
import { User, UsersFormType } from "../entities/entities.ts";
import PlaylistAdd from '@mui/icons-material/PlaylistAdd';
import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded';
import EditRounded from '@mui/icons-material/EditRounded';
import { CrmTableContainer } from "../../../utils/components/core/CrmTableContainer";
import { useAtomValue, useSetAtom } from "jotai";
import { CrmContainer } from "../../../utils/components/core/CrmContainer";
import { modulesUseCase } from "../../modules/usecase/ModulesUseCase";
import { popup } from "../../../utils/alerts/Popup";
import { useAuth } from "../../../core/auth/provider/AuthProvider";
import UserState from "../state/UserState";


export const UsersList = () => {
    const modifiedUser = useSetAtom(UserState.UserFormUUIDAtom);
    const modifedUserForm = useSetAtom(UserState.UserFormTypeAtom);
    const usersAtom = useAtomValue(UserState.UsersListAtom);
    const updateUser = useSetAtom(UserState.UserUpdateAtom);

    const {modules: userModules} = useAuth();
    const systemRoles = userModules?.find(x => x.code === "SYSTEM_ROLES");

    let users: User[] = [];

    // const deleteUser = (uuid: string) => {
    //     if (!systemRoles || systemRoles?.roles?.find(x => x.code === "DELETE_ROLE") === undefined) {
    //         popup.toast("warning", "You don't have permission to delete modules", 2000);
    //         return;
    //     }

    //     popup.confirm("question", "Delete module?", "Are sure that want delete this module?", "Yes").then((r) => {
    //         if (r.isConfirmed) {
    //             usersUseCase.deleteUserByUUID(uuid).then((response) => {
    //                 if (response.error) {
    //                     popup.toast("error", response.error, 2000);
    //                 } else {
    //                     popup.toast("success", response.message as string, 2000);
    //                 }
    //                 updateList(prev => !prev);
    //             });
    //         }
    //     });
    // }

    if (usersAtom.state === "loading") {
        return(
            <CrmContainer>
                <CrmTableContainer sx={{height: 500}}>
                    <CircularProgress />
                </CrmTableContainer>
            </CrmContainer>
        );
    }

    if (usersAtom.state === "hasData") {
        users = usersAtom.data.users ?? [];
    }

    return (
        <CrmContainer>
            <CrmTableContainer sx={{height: 500}}>
                <CrmTable 
                    sx={{
                        "& thead th:nth-child(1)": {
                            width: 200
                        },
                        "& thead th:nth-child(2)": {
                            width: 200
                        },
                        "& thead th:nth-child(3)": {
                            width: 200
                        },
                        "& thead th:nth-child(4)": {
                            width: 200
                        },
                        "& thead th:nth-child(5)": {
                            width: 200
                        },
                        "& thead th:nth-child(6)": {
                            width: 200
                        },
                    }}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Surname</th>
                                <th>Email</th>
                                <th>Document</th>
                                <th>Phone</th>
                                <th>State</th>
                                <th>City</th>
                                <th>Edit</th>
                                <th>Remove</th>
                                {/* <th colSpan={2} style={{textAlign:"center"}}>Actions</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user: User) => (
                                <tr key={`user_list_key_${user.uuid}`}>
                                    <td>{user.name}</td>
                                    <td>{user.surname}</td>
                                    <td>{user.email}</td>
                                    <td>{user.document}</td>
                                    <td>{user.phone}</td>
                                    <td>{user.state}</td>
                                    <td>{user.city}</td>
                                    <td>
                                        <IconButton
                                            size={"sm"}
                                            onClick={() => {
                                                modifiedUser(user?.uuid ?? '')
                                                modifedUserForm(UsersFormType.EDIT_USER)
                                            }}
                                        >
                                            <EditRounded/>
                                        </IconButton>
                                    </td>
                                    <td>
                                        <IconButton
                                            size={"sm"}
                                            onClick={() => {
                                                
                                            }}
                                        >
                                            <DeleteOutlineRounded/>
                                        </IconButton>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </CrmTable>
            </CrmTableContainer>
        </CrmContainer>
    )
}