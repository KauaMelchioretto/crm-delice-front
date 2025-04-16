import { CircularProgress, IconButton } from "@mui/joy";
import { CrmTable } from "../../../utils/components/core/CrmTable";

import PlaylistAdd from '@mui/icons-material/PlaylistAdd';
import DeleteOutlineRounded from '@mui/icons-material/DeleteOutlineRounded';
import EditRounded from '@mui/icons-material/EditRounded';
import { CrmTableContainer } from "../../../utils/components/core/CrmTableContainer";
import { useAtomValue, useSetAtom } from "jotai";
import { CrmContainer } from "../../../utils/components/core/CrmContainer";
import { modulesUseCase } from "../../modules/usecase/ModulesUseCase";
import { popup } from "../../../utils/alerts/Popup";
import { useAuth } from "../../../core/auth/provider/AuthProvider";


export const UsersList = () => {

}