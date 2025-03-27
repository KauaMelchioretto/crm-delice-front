import { useEffect, useState } from "react";
import { TextField } from "@mui/material";

const CpfInput = () => {

    return (
        <div className="relative w-full">
            <TextField label="CPF" variant="standard" id="standard-basic"></TextField>
        </div>
    );
}