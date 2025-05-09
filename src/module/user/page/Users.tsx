import {Box, Button, Typography} from "@mui/joy";
import {CrmContainer} from "../../../utils/components/core/CrmContainer";
import {useSetAtom} from "jotai";
import {UsersList} from "../components/UsersList";
import UserState from "../state/UserState.ts";
import {UserForm} from "../components/UserForm.tsx";
import {UsersFormType} from "../entities/entities.ts";

export const User = () => {
    const modifiedUserForm = useSetAtom(UserState.UserFormTypeAtom);

    return (
        <Box
            sx={{
                height: "100%",
                width: "100%",
                gap: 2,
                display: "flex",
                flexDirection: "column"
            }}
        >

            <CrmContainer
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >
                <Typography level={"body-lg"} fontWeight={"bold"}>Users</Typography>
                <Button size="sm" onClick={() => modifiedUserForm(UsersFormType.REGISTER_USER)}>
                    Register user
                </Button>
            </CrmContainer>
            <Box display={"flex"} gap={2}>
                <UsersList/>
                <UserForm/>
            </Box>
        </Box>
    );
}