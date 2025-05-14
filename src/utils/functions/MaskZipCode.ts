export function maskZipCode(v: string) {
    if(!v){
        return ""
    }

    v = v.replace(/\D/g, "")
    v = v.replace(/(\d{5})(\d{3})/, "$1-$2")
    return v
}