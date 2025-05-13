import { CircularProgress, IconButton, Stack } from "@mui/joy";
import { CrmTable } from "../../../utils/components/core/CrmTable";
import { User, UsersFormType } from "../entities/entities.ts";
import EditRounded from "@mui/icons-material/EditRounded";
import { CrmTableContainer } from "../../../utils/components/core/CrmTableContainer";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { CrmContainer } from "../../../utils/components/core/CrmContainer";
import UserState from "../state/UserState";
import { maskCPF } from "../../../utils/functions/DocumentValidation.ts";
import Rule from "@mui/icons-material/Rule";
import { useAuth } from "../../../core/auth/provider/AuthProvider.tsx";
import { maskPhone } from "../../../utils/functions/MaskPhone.ts";
import { Menu, Pagination } from "@mui/material";
import FilterState from "../../filter/entities/state/FilterState.ts";

import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { Theme, useTheme } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import { Filter } from "../../filter/entities/entities.ts";

export const UsersList = () => {
  const modifiedUser = useSetAtom(UserState.UserFormUUIDAtom);
  const modifiedUserForm = useSetAtom(UserState.UserFormTypeAtom);
  const usersAtom = useAtomValue(UserState.UsersListAtom);

  const { modules: userModules } = useAuth();

  const systemRoles = userModules?.find((x) => x.code === "USER_MODULE");
  const userModulesRoles = systemRoles?.roles?.map((x) => x.code);

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  function getStyles(name: string, personName: string[], theme: Theme) {
    return {
      fontWeight: personName.includes(name)
        ? theme.typography.fontWeightMedium
        : theme.typography.fontWeightRegular,
    };
  }

  const filterFields = [
    "user",
    "name",
    "email",
    "document",
    "phone",
    "state",
    "city",
  ];

  const theme = useTheme();
  const [filter, setFilter] = useAtom(FilterState.FilterListAtom);

  const handleChange = (event: SelectChangeEvent) => {
    const {
      target: { value },
    } = event;
    setFilter({ field: value, value: undefined });
  };

  let users: User[] = [];

  if (usersAtom.state === "loading") {
    return (
      <CrmContainer>
        <CrmTableContainer sx={{ height: 500 }}>
          <CircularProgress />
        </CrmTableContainer>
      </CrmContainer>
    );
  }

  if (usersAtom.state === "hasData") {
    users = usersAtom.data.items ?? [];
  }

  return (
    <CrmContainer>
      <div>
        <FormControl sx={{ m: 0, width: 300 }}>
          <InputLabel>Field</InputLabel>
          <Select
            labelId="tableFieldsLabel"
            id="tableFieldsFilter"
            value={filter?.field ?? ""}
            onChange={handleChange}
            input={<OutlinedInput label="Field" />}
            MenuProps={MenuProps}
          > 
            {filterFields.map((field) => (
              <MenuItem
                key={field}
                value={field}
                style={getStyles(field, filterFields, theme)}
                >
                  {field}
                </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <CrmTableContainer sx={{ height: 500 }}>
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
              <th>User</th>
              <th>Name</th>
              <th>Email</th>
              <th>Document</th>
              <th>Phone</th>
              <th>State</th>
              <th>City</th>
              <th>Edit</th>
              <th>Roles</th>
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
                    <EditRounded />
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
                    <Rule />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </CrmTable>
      </CrmTableContainer>
      <UserPagination />
    </CrmContainer>
  );
};

const UserPagination = () => {
  const [page, setPage] = useAtom(UserState.UserListPage);
  const pageCount = useAtomValue(UserState.UserListTotalCountAtom);

  const handleChange = (_: any, value: number) => {
    setPage(--value);
  };

  if (pageCount.state === "loading") return;

  const count = pageCount.state === "hasData" ? pageCount.data : 0;

  return (
    <Stack spacing={0}>
      <Pagination
        page={page + 1}
        count={count}
        variant="outlined"
        shape="rounded"
        onChange={handleChange}
      />
    </Stack>
  );
};
