export function truncateDecimal(value: number, decimalsLength: number = 2) {
    const factorMultiply = 10 ** decimalsLength
    const factorDivide = 1 / factorMultiply

    return Math.trunc(value / factorDivide) / factorMultiply
}

export function roundDecimal(value: number, decimalsLength: number = 2) {
    const factorMultiply = 10 ** decimalsLength
    const factorDivide = 1 / factorMultiply

    return Math.round(value / factorDivide) / factorMultiply
}

function toNumber(this: string | number) {
    try {
        if (!this) {
            throw new Error()
        }

        return Number(String(this).replace(',', '.'))
    } catch (e) {
        return NaN
    }
}

interface ToOrdinalOptions {
    gender?: 'M' | 'F'
}

function toOrdinal(this: number, options: ToOrdinalOptions = {}) {
    if (!Number.isInteger(this)) {
        throw new Error("Não implementado para números não inteiros.")
    }

    if (this > 999) {
        throw new Error("Não implementado para números maiores que 999.")
    }

    if (this < 0) {
        throw new Error("Não implementado para números negativos.")
    }

    const genderSuffix = options?.gender === 'F' ? 'a' : 'o'
    let txt = ''

    if (this < 1000 && this > 99) {
        const t = ["", "cent", "ducent", "trecent", "quadrigent", "quingent", "sexcent", "septigent", "octigent", "nongent"]
        const n100 = Math.floor(this / 100)
        const l = this - (n100 * 100)
        txt = `${t[n100]}ésim${genderSuffix} ${l.toOrdinal(options)}`
    }

    if (this < 100 && this > 19) {
        const x = ["", "", "vig", "trig", "quadrag", "quinquag", "sexag", "septuag", "octog", "nonag"]
        const n10 = Math.floor(this / 10)
        const l = this - (n10 * 10)
        txt = `${x[n10] + (n10 > 1 ? `ésim${genderSuffix}` : "")} ${l.toOrdinal(options)}`
    }

    if (this > 9 && this < 20) {
        const x = 'décim'
        const n10 = Math.floor(this / 10)
        const l = this - (n10 * 10)
        txt = `${x}${genderSuffix} ${l.toOrdinal(options)}`
    }

    if (this < 10 && this > 0) {
        const u = ["", "primeir", "segund", "terceir", "quart", "quint", "sext", "sétim", "oitav", "non"]
        txt = u[this] + genderSuffix
    }

    return txt.trim()
}

declare global {
    interface String {
        toNumber(this: string | number): number
    }

    interface Number {
        toOrdinal(this: number, options?: ToOrdinalOptions): string
    }
}

String.prototype.toNumber = toNumber
Number.prototype.toOrdinal = toOrdinal
