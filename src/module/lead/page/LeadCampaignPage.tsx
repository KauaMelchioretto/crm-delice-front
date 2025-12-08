import {Box, Typography, Card, Grid, styled} from "@mui/joy";
import {useLoaderData} from "react-router-dom";
import {LeadForm} from "../components/LeadForm.tsx";
import {Campaign} from "../../campaign/entities/entities.ts";

const StyledCardButton = styled(Card)(() => ({
    flex: 1,
    textWrap: "nowrap",
    textAlign: "center",
    fontWeight: "bold",
    [":hover"]: {
        transform: "scale(1.01)"
    },
    transition: "all 0.1s ease-in-out",
    cursor: "pointer"
}))

export const LeadCampaignPage = () => {
    const campaign = useLoaderData() as Campaign

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#fffbeb",
                alignItems: "center",
            }}
        >
            <title>{campaign.title}</title>
            <Box
                sx={{
                    width: "100%",
                    height: "400px",
                    backgroundImage: "linear-gradient(to right, #78350f, #92400e, #78350f)",
                    position: "relative",
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "40%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 3,
                        width: "100%"
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center"
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight: "bold",
                                fontSize: "3rem",
                                color: "#FFFFFF",
                                lineHeight: 1,
                                textAlign: "center"
                            }}
                        >
                            Sabor Artesanal,
                        </Typography>
                        <Typography
                            sx={{
                                fontWeight: "bold",
                                fontSize: "3rem",
                                color: "#fcd34d",
                                lineHeight: 1,
                                textAlign: "center"
                            }}
                        >
                            Qualidade Premium
                        </Typography>
                    </Box>
                    <Typography
                        sx={{
                            fontSize: "1.25rem",
                            color: "#fef3c7",
                            lineHeight: "1.75rem",
                            textAlign: "center"
                        }}
                    >
                        Grissinis, biscoitos e torradas que encantam
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 1,
                            width: {
                                xl: "40%",
                                lg: "50%",
                                md: "60%",
                                sm: "80%",
                                xs: "95%"
                            }
                        }}
                    >
                        <StyledCardButton
                            size={"sm"}
                            onClick={() => {
                                const section = document.getElementById("our-products");
                                if (section) {
                                    section.scrollIntoView({ behavior: "smooth" });
                                }
                            }}
                        >
                            Quero conhecer os produtos
                        </StyledCardButton>
                        <StyledCardButton
                            size={"sm"}
                            onClick={() => {
                                const section = document.getElementById("new-lead");
                                if (section) {
                                    section.scrollIntoView({ behavior: "smooth" });
                                }
                            }}
                        >
                            Quero ser parceiro
                        </StyledCardButton>
                    </Box>
                </Box>
                <Box
                    sx={{
                        position: "absolute",
                        right: 0,
                        bottom: 0,
                        left: 0,
                        ["& svg"]: {
                            marginTop: "auto"
                        },
                        display: "flex",
                        flexDirection: "column"
                    }}
                >
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
                            fill="#fffbeb"></path>
                    </svg>
                </Box>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: {
                        xl: "80%",
                        lg: "80%",
                        md: "80%",
                        sm: "90%",
                        xs: "95%"
                    },
                    pb: 10
                }}
            >
                <Grid container spacing={2} sx={{flexGrow: 1}}>
                    <Grid
                        xl={6}
                        lg={6}
                        md={12}
                        sm={12}
                        xs={12}
                    >
                        <BusinessAttributeCard
                            title={"Qualidade Premium"}
                            description={"Produtos artesanais feitos com ingredientes selecionados"}
                        />
                    </Grid>
                    <Grid
                        xl={6}
                        lg={6}
                        md={12}
                        sm={12}
                        xs={12}
                    >
                        <BusinessAttributeCard
                            title={"Receitas Tradicionais"}
                            description={"Fermentação natural e processos artesanais"}
                        />
                    </Grid>
                    <Grid
                        xl={12}
                        lg={12}
                        md={12}
                        sm={12}
                        xs={12}
                    >
                        <BusinessAttributeCard
                            title={"Variedade Sazonal"}
                            description={"Produtos especiais para cada época do ano"}
                        />
                    </Grid>
                </Grid>
            </Box>
            <Box
                id={"our-products"}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                    backgroundColor: "#FFFFFF",
                    p: 2,
                    pt: 10,
                    pb: 10
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Typography
                        sx={{
                            fontWeight: "bold",
                            fontSize: "3rem",
                            textAlign: "center",
                            lineHeight: 1,
                            color: "#1f2937"
                        }}
                    >
                        Nossos produtos
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: "2rem",
                            textAlign: "center",
                            color: "#4b5577"
                        }}
                    >
                        Descubra a variedade que oferecemos
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        mt: 5,
                        width: {
                            xl: "80%",
                            lg: "80%",
                            md: "80%",
                            sm: "90%",
                            xs: "95%"
                        },
                    }}
                >
                    <Grid container spacing={2} sx={{flexGrow: 1}}>
                        <Grid
                            xl={6}
                            lg={6}
                            md={6}
                            sm={6}
                            xs={6}
                        >
                            <BusinessProductCard
                                icon={"🥖"}
                                title={"Grissinis"}
                                description={"Crocantes e saborosos"}
                            />
                        </Grid>
                        <Grid
                            xl={6}
                            lg={6}
                            md={6}
                            sm={6}
                            xs={6}
                        >
                            <BusinessProductCard
                                icon={"🍪"}
                                title={"Biscoitos Artesanais"}
                                description={"Variedade de sabores"}
                            />
                        </Grid>
                        <Grid
                            xl={6}
                            lg={6}
                            md={6}
                            sm={6}
                            xs={6}
                        >
                            <BusinessProductCard
                                icon={"🍞"}
                                title={"Torradas"}
                                description={"Fermentação natural"}
                            />
                        </Grid>
                        <Grid
                            xl={6}
                            lg={6}
                            md={6}
                            sm={6}
                            xs={6}
                        >
                            <BusinessProductCard
                                icon={"🎁"}
                                title={"Produtos Sazonais"}
                                description={"Páscoa, Natal e mais"}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Box
                id={"new-lead"}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    mt: 2,
                    width: "100%",
                    backgroundColor: "#fffbeb",
                    p: 2,
                    pb: 10,
                    pt: 10
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: "#ffffff",
                        boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                        width: {
                            xl: "80%",
                            lg: "80%",
                            md: "80%",
                            sm: "90%",
                            xs: "95%"
                        },
                        p: 3,
                        borderRadius: (theme) => theme.radius.xl
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            pb: 5
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight: "bold",
                                fontSize: "2rem",
                                textAlign: "center",
                                lineHeight: 1,
                                color: "#1f2937"
                            }}
                        >
                            Seja Nosso Parceiro
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: "1rem",
                                textAlign: "center",
                                color: "#4b5577"
                            }}
                        >
                            Preencha o formulário e descubra como podemos atender seu negócio
                        </Typography>
                    </Box>
                    <LeadForm
                        fields={campaign.metadata!.campaignLeadFields!}
                    />
                </Box>
            </Box>
            <Box
                sx={{
                    width: "100%",
                    height: "250px",
                    backgroundImage: "linear-gradient(to right, #78350f, #92400e, #78350f)",
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "center",
                    p: 5
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                    }}
                >
                    <Typography
                        sx={{
                            fontWeight: "bold",
                            fontSize: "2rem",
                            color: "#FFFFFF",
                            lineHeight: 1,
                            textAlign: "center"
                        }}
                    >
                        Delice Indústria de Biscoitos LTDA
                    </Typography>
                </Box>
                <Typography
                    sx={{
                        fontSize: "1.25rem",
                        color: "#fddc56",
                        lineHeight: "1.75rem",
                        textAlign: "center"
                    }}
                >
                    Tradição e qualidade em cada produto
                </Typography>
                <Typography
                    sx={{
                        fontSize: "0.9rem",
                        color: "#fddc56",
                        textAlign: "center",
                        mt: "auto"
                    }}
                >
                    © 2025 Delice. Todos os direitos reservados.
                </Typography>
            </Box>
        </Box>
    )
}

interface BusinessAttributeCardProps {
    title: string
    description: string
}

const BusinessAttributeCard = (props: BusinessAttributeCardProps) => (
    <Card
        variant={"plain"}
        sx={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
            background: 'linear-gradient(135deg, #b38940 0%, #d4a556 100%)'
        }}
    >
        <Typography
            level={"title-md"}
            fontWeight={"bold"}
            sx={{color: "#FFFFFF",}}
        >
            {props.title}
        </Typography>
        <Typography
            level={"body-md"}
            sx={{color: "#FFFFFF",}}
        >
            {props.description}
        </Typography>
    </Card>
)

interface BusinessProductCardProps {
    icon: string
    title: string
    description: string
}

const BusinessProductCard = (props: BusinessProductCardProps) => (
    <Card
        variant={"plain"}
        sx={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            background: 'linear-gradient(135deg, #b38940 0%, #d4a556 100%)',
            height: "100%",
        }}
    >
        <Typography sx={{fontSize: "2rem"}}>
            {props.icon}
        </Typography>
        <Typography level={"title-md"} fontWeight={"bold"} sx={{color: "#FFFFFF"}}>
            {props.title}
        </Typography>
        <Typography level={"body-md"} sx={{color: "#FFFFFF"}}>
            {props.description}
        </Typography>
    </Card>
)