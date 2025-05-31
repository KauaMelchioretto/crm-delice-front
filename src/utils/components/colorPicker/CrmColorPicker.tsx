import {useState} from 'react';
import {Box, Input, Sheet} from '@mui/joy';
import {HexColorPicker} from 'react-colorful';

interface CrmColorPickerProps {
    initialColor: string,
    onChange: (newColor: string) => void
}

export const CrmColorPicker = (props: CrmColorPickerProps) => {
    const [color, setColor] = useState(props.initialColor);

    const [open, setOpen] = useState(false);

    const handleColorChange = (newColor: string) => {
        setColor(newColor);
        props.onChange(newColor);
    };

    return (
        <Sheet
            variant="outlined"
            sx={{
                p: 1,
                borderRadius: 'md',
                position: "relative",
                flex: 1
            }}
        >
            <div
                style={{
                    position: "absolute",
                    bottom: 54,
                    right: 0,
                }}
            >
                {open && (
                    <Box
                        sx={{
                            backgroundColor: "var(--joy-palette-background-surface)",
                            borderRadius: 'sm',
                            border: '1px solid #ccc',
                            cursor: "pointer",
                            p: 1
                        }}
                    >
                        <HexColorPicker color={color} onChange={handleColorChange}/>
                    </Box>
                )}
            </div>
            <Box display="flex" gap={1} alignItems="center">
                <Input
                    value={color}
                    onChange={(e) => handleColorChange(e.target.value)}
                    size="sm"
                    sx={{width: 120, flex: 1}}
                />
                <Box
                    sx={{
                        width: 32,
                        height: 32,
                        backgroundColor: color,
                        borderRadius: 'sm',
                        border: '1px solid #ccc',
                        cursor: "pointer"
                    }}
                    onClick={() => {
                        setOpen(prev => !prev)
                    }}
                />
            </Box>
        </Sheet>
    );
};
