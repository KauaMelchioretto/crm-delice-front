import {useAtomValue, useSetAtom} from "jotai/index";
import CrmState from "../../../utils/state/CrmState.ts";
import {useAuth} from "../../../core/auth/provider/AuthProvider.tsx";
import {CrmDefaultRoles, CrmField, CrmFormType, CrmModules} from "../../../utils/entities/entities.ts";
import CampaignState from "../state/CampaignState.ts";
import {CrmContainer} from "../../../utils/components/core/CrmContainer.tsx";
import {CrmError} from "../../../utils/components/core/CrmError.tsx";
import {CircularProgress, IconButton} from "@mui/joy";
import {FilterComponent} from "../../../utils/components/filter/FilterComponent.tsx";
import {CrmTableContainer} from "../../../utils/components/core/CrmTableContainer.tsx";
import {CrmTable} from "../../../utils/components/core/CrmTable.tsx";
import {CrmTableHead} from "../../../utils/components/core/CrmTableHead.tsx";
import {Campaign, CampaignType, getCampaignStatusProps, getCampaignTypeProps} from "../entities/entities.ts";
import {CrmPaginationAtom} from "../../../utils/components/pagination/CrmPagination.tsx";
import {CrmCardStatus} from "../../../utils/components/core/CrmCardStatus.tsx";
import dayjs from "dayjs";
import {EditRounded} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import {valueToEnum} from "../../../utils/functions/ValueToEnum.ts";
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';

export const CampaignList = () => {
    const setEntityForm = useSetAtom(CrmState.EntityFormUUID);
    const setFormType = useSetAtom(CrmState.FormType);
    const campaignAtom = useAtomValue(CampaignState.ListAtom);

    const {getRolesByModule} = useAuth();

    const navigate = useNavigate()

    const roles = getRolesByModule(CrmModules.Campaign);

    const canCreate = roles.filter(
        (x) => x.code === CrmDefaultRoles.CREATE_CAMPAIGN || x.code === CrmDefaultRoles.ALL_CAMPAIGN
    ).length > 0;

    const campaignFields: CrmField[] = [
        {
            key: "title",
            label: "Titulo",
        },
        {
            key: "start",
            label: "Inicio",
        },
        {
            key: "end",
            label: "Fim",
        },
        {
            key: "type",
            label: "Tipo",
        },
        {
            key: "status",
            label: "status",
        },
        {
            key: "access",
            label: "Acessar",
        },
    ]

    if (canCreate) {
        campaignFields.push({
            key: "edit",
            label: "Editar",
        })
    }

    switch (campaignAtom.state) {
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
                        fields={campaignFields}
                        filterAtom={CampaignState.FilterAtom}
                    />
                    <CrmTableContainer>
                        <CrmTable
                            sx={{
                                "& thead th:nth-child(1)": {
                                    width: 300,
                                },
                                "& thead th:nth-child(2)": {
                                    width: 100,
                                },
                                "& thead th:nth-child(3)": {
                                    width: 100,
                                },
                                "& thead th:nth-child(4)": {
                                    width: 100,
                                },
                                "& thead th:nth-child(5)": {
                                    width: 100,
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
                            <CrmTableHead
                                fields={campaignFields}
                                orderByAtom={CampaignState.OrderByAtom}
                            />
                            <tbody>
                            {campaignAtom.data?.campaigns?.items?.map((campaign: Campaign) => (
                                <tr key={`campaign_list_key_${campaign.uuid}`}>
                                    <td>
                                        {campaign.title}
                                    </td>
                                    <td>
                                        {campaign.start === null ? "-" : dayjs(campaign.start).format("DD/MM/YYYY HH:mm")}
                                    </td>
                                    <td>
                                        {campaign.end === null ? "-" : dayjs(campaign.end).format("DD/MM/YYYY HH:mm")}
                                    </td>
                                    <td>
                                        <CrmCardStatus {...getCampaignTypeProps(campaign.type!.toString())}/>
                                    </td>
                                    <td>
                                        <CrmCardStatus {...getCampaignStatusProps(campaign.status!.toString())}/>
                                    </td>
                                    <td>
                                        {
                                            valueToEnum(campaign.type, CampaignType) === CampaignType.LEAD && (
                                                <IconButton
                                                    size={"sm"}
                                                    onClick={() => {
                                                        navigate(`/visit/${campaign.uuid}`)
                                                    }}
                                                >
                                                    <OpenInNewRoundedIcon/>
                                                </IconButton>
                                            )
                                        }
                                    </td>
                                    {
                                        canCreate && (
                                            <td>
                                                <IconButton
                                                    size={"sm"}
                                                    onClick={() => {
                                                        setEntityForm(campaign?.uuid ?? "");
                                                        setFormType(CrmFormType.EDIT_CAMPAIGN);
                                                    }}
                                                >
                                                    <EditRounded/>
                                                </IconButton>
                                            </td>
                                        )
                                    }
                                </tr>
                            ))}
                            </tbody>
                        </CrmTable>
                    </CrmTableContainer>
                    <CrmPaginationAtom
                        page={CampaignState.PageAtom}
                        count={CampaignState.ListTotalCountAtom}
                    />
                </CrmContainer>
            )
    }
}