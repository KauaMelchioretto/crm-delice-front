import CampaignState from "../state/CampaignState.ts";
import {Box, Breadcrumbs, CircularProgress, Link, Typography} from "@mui/joy";
import {useNavigate} from "react-router-dom";
import {useTheme} from "@mui/material";
import {CrmTitleContainer} from "../../../utils/components/core/CrmTitleContainer.tsx";
import {CrmContainer} from "../../../utils/components/core/CrmContainer.tsx";
import {CampaignType} from "../entities/entities.ts";
import {LeadCampaignConfig} from "../components/LeadCampaignConfig.tsx";
import {SaleCampaignConfig} from "../components/SaleCampaignConfig.tsx";
import {valueToEnum} from "../../../utils/functions/ValueToEnum.ts";

export const CampaignData = () => {
    const theme = useTheme()
    const {isPending, campaign} = CampaignState.useCampaignDetails()

    const navigate = useNavigate()

    if (isPending || !campaign) {
        return (
            <Box
                sx={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <CircularProgress/>
            </Box>
        )
    }

    const crumbs = [
        {
            label: "Campanhas",
            nav: () => navigate(-1)
        },
        {
            label: campaign?.title,
            nav: () => navigate(0)
        },
        {
            label: "Configurar"
        }
    ]

    return (
        <Box
            sx={{
                height: "100%",
                width: "100%",
                display: "grid",
                gridTemplateRows: `calc(2.5rem + ${theme.spacing(0.5)} + var(--Button-minHeight, 2rem)) 1fr`
            }}
        >
            <CrmTitleContainer
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "start",
                }}
            >
                <Box
                    sx={{
                        gap: 0.5,
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Typography
                        level={"body-lg"}
                        fontWeight={"bold"}
                    >
                        {campaign?.title}
                    </Typography>
                    <Breadcrumbs sx={{p: 0}}>
                        {
                            crumbs.map((item) => (
                                <Link
                                    level={"body-xs"}
                                    color={"neutral"}
                                    onClick={() => {
                                        if (item.nav) {
                                            item.nav()
                                        }
                                    }}
                                >
                                    {item.label}
                                </Link>
                            ))
                        }
                    </Breadcrumbs>
                </Box>
            </CrmTitleContainer>
            <CrmContainer
                sx={{
                    width: "100%",
                    borderRadius: "8px",
                    p: 1,
                    display: "flex",
                    flexDirection: "column",
                    overflowY: "auto",
                    gap: 1
                }}
            >
                {
                    valueToEnum(campaign!.type, CampaignType) === CampaignType.LEAD ? (
                        <LeadCampaignConfig campaign={campaign!}/>
                    ) : (
                        <SaleCampaignConfig campaign={campaign!}/>
                    )
                }
            </CrmContainer>
        </Box>
    )
}