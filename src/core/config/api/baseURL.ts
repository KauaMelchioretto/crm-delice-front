export const baseURL = (): string | null => {
    if(process.env.NODE_ENV === "production") {
        return null;
    } else {
        return "http://localhost:9000/";
    }
};