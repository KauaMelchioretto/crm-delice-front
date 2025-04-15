import { TextInput } from "../core/TextInput"
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export const CustomDatePicker = () => {
    return(
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker/>
            </LocalizationProvider>
    );
}