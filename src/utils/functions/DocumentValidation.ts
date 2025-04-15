export function cpfValidation(cpf: string) : boolean  {
    cpf = cpf.replace(/[.-]/g, "");

    if (cpf.length !== 11) return false;

    if (/^(\d)\1+$/.test(cpf)) return false;

    let sum = 0;

    for(let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }

    let firstDigit = (sum * 10) % 11;
    if(firstDigit === 10) firstDigit = 0;
    if(firstDigit !== parseInt(cpf.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }

    let secondDigit = (sum * 10) % 11;
    if (secondDigit === 10) secondDigit = 0;
    if (secondDigit !== parseInt(cpf.charAt(10))) return false;

    return true;
}

export function cnpjValidation (cnpj : string) : boolean {
    cnpj = cnpj.replace(/[.\-\/]/g, "");

    if (cnpj.length !== 14) return false;

    if (/^(\d)\1+$/.test(cnpj)) return false;

    const calcDigit = (cnpjPartial: string, pos: number[]): number => {
        const sum = cnpjPartial
            .split('')
            .reduce((acc, curr, i) => acc + parseInt(curr) * pos[i], 0);

        const rest = sum % 11;
        return rest < 2 ? 0 : 11 - rest;
    };

    const firstWeights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const secondWeights = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    const base = cnpj.slice(0, 12);
    const firstDigit = calcDigit(base, firstWeights);
    const secondDigit = calcDigit(base + firstDigit, secondWeights);

    return (
        firstDigit === parseInt(cnpj.charAt(12)) &&
        secondDigit === parseInt(cnpj.charAt(13))
    );
}