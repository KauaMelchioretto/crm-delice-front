import {FieldValues, useForm} from "react-hook-form";
import {Box, Button, FormControl, FormHelperText, FormLabel, Input} from "@mui/joy";

export const LoginPage = () => {
    return (
        <Box sx={{width: "25vw"}}>
            <LoginForm/>
        </Box>
    )
}

export const LoginForm = () => {
    const {register, handleSubmit, formState: {errors}} = useForm();

    const handleLogin = handleSubmit((data: FieldValues) => {
        console.log(data)
    })

    return (
        <Box
            component={"form"}
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2
            }}
            onSubmit={handleLogin}
        >
            <FormControl>
                <FormLabel>Login</FormLabel>
                <Input {...register("login", {required: "The login is required"})} />
                <FormHelperText sx={{minHeight: "1rem"}}>
                    {errors?.login?.message as string}
                </FormHelperText>
            </FormControl>
            <FormControl>
                <FormLabel>Senha</FormLabel>
                <Input {...register("password", {required: "The password is required"})} />
                <FormHelperText sx={{minHeight: "1rem"}}>
                    {errors?.password?.message as string}
                </FormHelperText>
            </FormControl>
            <Button type={"submit"}>Submit</Button>
        </Box>
    );
}