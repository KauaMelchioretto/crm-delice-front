import { CrmContainer } from "../../../utils/components/core/CrmContainer.tsx";
import { FilterComponent } from "../../../utils/components/filter/FilterComponent.tsx";
import { CrmTableContainer } from "../../../utils/components/core/CrmTableContainer.tsx";
import KanbanState from "../state/KanbanState.ts";
import { useTranslation } from "react-i18next";
import { CrmTable } from "../../../utils/components/core/CrmTable.tsx";
import {
  CrmFieldOption,
  CrmFormType,
  CrmModules,
} from "../../../utils/entities/entities.ts";
import { useAuth } from "../../../core/auth/provider/AuthProvider.tsx";
import VerifiedRounded from "@mui/icons-material/VerifiedRounded";
import CancelRounded from "@mui/icons-material/CancelRounded";
import { Board, BoardStatus } from "../entities/entities.ts";
import { getColorContrast } from "../../../utils/functions/GetColorContrast.ts";
import { Box, CircularProgress, IconButton, Typography } from "@mui/joy";
import { useAtom, useAtomValue } from "jotai/index";
import { EditRounded } from "@mui/icons-material";
import { ChangeEvent } from "react";
import { CrmPagination } from "../../../utils/components/pagination/CrmPagination.tsx";

import LeaderboardRoundedIcon from "@mui/icons-material/LeaderboardRounded";
import LanRoundedIcon from "@mui/icons-material/LanRounded";
import LayersRoundedIcon from "@mui/icons-material/LayersRounded";
import CrmState from "../../../utils/state/CrmState.ts";
import { useSetAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../../core/config/app/AppProvider.tsx";
import { CrmTableHead } from "../../../utils/components/core/CrmTableHead.tsx";

export const BoardList = () => {
  const setFormType = useSetAtom(CrmState.FormType);
  const setEntityUUID = useSetAtom(CrmState.EntityFormUUID);

  const { t } = useTranslation();
  const { getRolesByModule } = useAuth();
  const { getModuleByCode } = useApp();

  const kanbanRuleModule = getModuleByCode(CrmModules.KanbanRule);

  const navigate = useNavigate();

  const boardAtom = useAtomValue(KanbanState.ListAtom);

  const roles = getRolesByModule(CrmModules.Kanban);

  const canCreate =
    roles.filter((x) => x.code === "CREATE_KANBAN" || x.code === "ALL_KANBAN")
      .length > 0;

  const boardStatus = {
    [BoardStatus.ACTIVE]: {
      color: "#118D57",
      label: t("kanbans.status.board.active"),
      icon: VerifiedRounded,
    },
    [BoardStatus.INACTIVE]: {
      color: "#ff543f",
      label: t("kanbans.status.board.inactive"),
      icon: CancelRounded,
    },
  };

  const boardStatusOptions: CrmFieldOption[] = [
    { value: "", label: t("filter_keys.none") },
    ...Object.entries(boardStatus).map(([key, value]) => ({
      value: key,
      label: value.label,
    })),
  ];

  const boardFieldsFilter = [
    { value: "", label: t("filter_keys.none") },
    { value: "title", label: t("kanbans.fields.title") },
    { value: "description", label: t("kanbans.fields.description") },
    {
      value: "status",
      label: t("kanbans.fields.status"),
      filterableByOptions: true,
      filterOptions: boardStatusOptions,
    },
  ];

  const boardFields = [
    ...boardFieldsFilter,
    { value: t("actions.edit"), label: t("actions.edit") },
    {
      value: t("kanbans.fields.edit_tags"),
      label: t("kanbans.fields.edit_tags"),
    },
    {
      value: t("kanbans.fields.edit_columns"),
      label: t("kanbans.fields.edit_columns"),
    },
    {
      value: t("kanbans.fields.edit_rules"),
      label: t("kanbans.fields.edit_rules"),
    },
  ];

  const CardStatus = ({ status }: { status: string }) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const s = boardStatus[BoardStatus[status]];

    const colors = getColorContrast(s.color);

    const Icon = s.icon;

    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          sx={{
            backgroundColor: colors.transparent,
            p: 0.5,
            borderRadius: "8px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <Icon
            sx={{
              color: s.color,
              fontSize: "14pt",
            }}
          />
          <Typography
            sx={{
              color: s.color,
              fontWeight: "bold",
              fontSize: "9pt",
            }}
          >
            {s.label}
          </Typography>
        </Box>
      </Box>
    );
  };

  if (boardAtom.state === "loading") {
    return (
      <CrmContainer sx={{ width: "100%" }}>
        <CrmTableContainer
          sx={{
            height: 500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </CrmTableContainer>
      </CrmContainer>
    );
  }

  let boards: Board[] = [];

  if (boardAtom.state === "hasData") {
    boards = boardAtom.data.items ?? [];
  }

  return (
    <CrmContainer>
      <FilterComponent
        fields={boardFieldsFilter}
        filterAtom={KanbanState.FilterAtom}
      />
      <CrmTableContainer sx={{ height: 450, pt: 2 }}>
        <CrmTable
          sx={{
            "& thead th:nth-child(1)": {
              width: 200,
            },
            "& thead th:nth-child(2)": {
              width: 350,
            },
            "& thead th:nth-child(3)": {
              width: 100,
            },
            "& thead th:nth-child(4)": {
              width: 50,
            },
            "& thead th:nth-child(5)": {
              width: 50,
            },
            "& thead th:nth-child(6)": {
              width: 50,
            },
            "& thead th:nth-child(7)": {
              width: 50,
            },
            "& td": {
              textWrap: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
            },
          }}
        >
          <thead>
            <tr>
              <CrmTableHead
                field={boardFields.find((x) => x.value === "title")!}
                orderByAtom={KanbanState.OrderByAtom}
              />
              <CrmTableHead
                field={boardFields.find((x) => x.value === "description")!}
                orderByAtom={KanbanState.OrderByAtom}
              />
              <CrmTableHead
                field={boardFields.find((x) => x.value === "status")!}
                orderByAtom={KanbanState.OrderByAtom}
              />
              {canCreate && <CrmTableHead
                field={boardFields.find((x) => x.value === t("actions.edit"))!}
                orderByAtom={null}
              />}
              {canCreate && <CrmTableHead
                field={boardFields.find((x) => x.value === t("kanbans.fields.edit_tags"))!}
                orderByAtom={null}
              />}
              {canCreate && <CrmTableHead
                field={boardFields.find((x) => x.value === t("kanbans.fields.edit_columns"))!}
                orderByAtom={null}
              />}
              {canCreate && <CrmTableHead
                field={boardFields.find((x) => x.value === t("kanbans.fields.edit_rules"))!}
                orderByAtom={null}
              />}
            </tr>
          </thead>
          <tbody>
            {boards?.map((board: Board) => (
              <tr key={`wallet_list_key_${board.uuid}`}>
                <td>{board.title}</td>
                <td>{board.description}</td>
                <td>
                  <CardStatus status={board?.status ?? "ACTIVE"} />
                </td>
                {canCreate && (
                  <td>
                    <IconButton
                      size={"sm"}
                      onClick={() => {
                        setFormType(CrmFormType.EDIT_BOARD);
                        setEntityUUID(board.uuid ?? "");
                      }}
                    >
                      <EditRounded />
                    </IconButton>
                  </td>
                )}
                {canCreate && (
                  <td>
                    <IconButton
                      size={"sm"}
                      onClick={() => {
                        setFormType(CrmFormType.EDIT_TAGS);
                        setEntityUUID(board.uuid ?? "");
                      }}
                    >
                      <LayersRoundedIcon />
                    </IconButton>
                  </td>
                )}
                {canCreate && (
                  <td>
                    <IconButton
                      size={"sm"}
                      onClick={() => {
                        setFormType(CrmFormType.EDIT_COLUMNS);
                        setEntityUUID(board.uuid ?? "");
                      }}
                    >
                      <LeaderboardRoundedIcon />
                    </IconButton>
                  </td>
                )}
                {canCreate && (
                  <td>
                    <IconButton
                      size={"sm"}
                      onClick={() => {
                        const url = kanbanRuleModule.path.replace(
                          ":uuid",
                          board.uuid ?? ""
                        );
                        navigate(url);
                      }}
                    >
                      <LanRoundedIcon />
                    </IconButton>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </CrmTable>
      </CrmTableContainer>
      <BoardPagination />
    </CrmContainer>
  );
};

export const BoardPagination = () => {
  const [page, setPage] = useAtom(KanbanState.PageAtom);
  const pageCount = useAtomValue(KanbanState.ListTotalCountAtom);

  if (pageCount.state === "loading") return;

  const count = pageCount.state === "hasData" ? pageCount.data : 0;
  const handleChange = (_: ChangeEvent<unknown>, value: number) => {
    setPage(--value);
  };

  return (
    <CrmPagination page={page + 1} count={count} onChange={handleChange} />
  );
};
