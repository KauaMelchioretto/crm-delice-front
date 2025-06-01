import {styled} from "@mui/joy";

export const CrmCheckbox = styled('input')(() => ({
    width: 15,
    height: 15,
    borderRadius: 8,
    border: '2px solid #c4c4c4',
    display: 'inline-block',
    position: 'relative',
    transition: 'all 0.2s ease',
    cursor: 'pointer',

    '&:checked': {
        borderColor: '#1976d2',
        backgroundColor: '#1976d2',
    },
}));