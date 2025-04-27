export function maskPhone(v: string) {
    if(!v){
        return ""
    }

    v = v.replace(/\D/g, "")
    v = v.replace(/(\d{2})(\d{2})(\d)(\d{4})(\d{4})/, "+$1 ($2) $3 $4-$5")
    return v
}