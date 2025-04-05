import {Box, BoxProps} from "@mui/joy";

const Root = (props: BoxProps) => (
    <Box
        {...props}
        sx={[
            {
                display: 'grid',
                gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'minmax(64px, 200px) minmax(450px, 1fr)',
                    md: 'minmax(160px, 240px) minmax(300px, 200px) minmax(500px, 1fr)',
                },
                gridTemplateRows: '50px 1fr',
                minHeight: '100vh',
            },
            ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
        ]}
    />
)

const Header = (props: BoxProps) => (
    <Box
        component="header"
        className="Header"
        {...props}
        sx={[
            {
                p: 1,
                gap: 2,
                bgcolor: 'background.surface',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                gridColumn: '1 / -1',
                borderBottom: '1px solid',
                borderColor: 'divider',
                position: 'sticky',
                top: 0,
                zIndex: 1100,
            },
            ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
        ]}
    />
)

const Main = (props: BoxProps) => (
    <Box
        component="main"
        className="Main"
        {...props}
        sx={[
            {p: 1},
            ...(Array.isArray(props.sx) ? props.sx : [props.sx])
        ]}
    />
)

const SideNav = (props: BoxProps) => (
    <Box
        component="nav"
        className="Navigation"
        {...props}
        sx={[
            {
                p: 1,
                bgcolor: 'background.surface',
                borderRight: '1px solid',
                borderColor: 'divider',
                display: {
                    xs: 'none',
                    sm: 'initial',
                },
            },
            ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
        ]}
    />
)

export default {
    Root,
    Header,
    Main,
    SideNav
}