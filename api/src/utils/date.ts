import { format, set, isValid, getYear, startOfWeek, addDays } from "date-fns"
import { ptBR } from 'date-fns/locale'

type Language = 'pt-BR' | 'en-US'

interface ParseDatetimeFromOptions {
	lang?: Language
	forceTime?: string
}

interface ParseDateFromOptions {
	lang?: Language
}

interface DateFromOptions {
	lang?: Language
	forceCurrentYear?: boolean
}

interface DateFromOptions {
	forceEndOfDay?: boolean
}

const BRDateTimeRegex = /^\d{2}\/\d{2}\/\d{4}( \d{2}:\d{2}:\d{2})?$/
const BRDateRegex = /^\d{2}\/\d{2}\/\d{4}$/
const BRSimplifiedDateRegex = /^\d{2}\/\d{2}$/
const USDateRegex = /^\d{4}-\d{2}-\d{2}$/

function BRDatetimeToUSDatetime(datetime: string) {
	if(!BRDateTimeRegex.test(datetime)) {
		throw new Error('Date passed to BRDatetimeToUSDatetime() is not a valid BR datetime.')
	}

	const [date, time] = datetime.split(' ')
	const [d, m, y] = date.split('/')

	return `${y}-${m}-${d} ${time || '00:00:00'}`
}

export function parseDatetimeFrom(input: string, options?: ParseDatetimeFromOptions) {
	if(!input) return input

	input = input?.trim()

	if(BRDateTimeRegex.test(input)) {
		input = BRDatetimeToUSDatetime(input)
	}

	let regularDate = new Date(`${input}`)

	if(!isValid(regularDate)) {
		throw new Error('Data inválida.')
	}

	if(options?.forceTime) {
		const [hours, minutes, seconds] = options.forceTime.split(':').map(item => Number(item))

		regularDate = set(regularDate, { hours, minutes, seconds })
	}

	if(options?.lang) {
		switch(options?.lang) {
			case 'pt-BR': return format(regularDate, 'dd/MM/yyyy HH:mm:ss')
			case 'en-US': return format(regularDate, 'yyyy-MM-dd HH:mm:ss')
			default: return format(regularDate, 'dd/MM/yyyy HH:mm:ss')
		}
	}
}

export function parseDateFrom(input: string, options?: ParseDateFromOptions) {
	if(!input) return input

	input = input?.trim()

	if(BRDateTimeRegex.test(input)) {
		input = BRDatetimeToUSDatetime(input)
	}

	let regularDate = new Date(`${input}`)

	if(!isValid(regularDate)) {
		throw new Error('Data inválida.')
	}

	if(options?.lang) {
		switch(options?.lang) {
			case 'pt-BR': return format(regularDate, 'dd/MM/yyyy')
			case 'en-US': return format(regularDate, 'yyyy-MM-dd')
			default: return format(regularDate, 'dd/MM/yyyy')
		}
	}
}

export function dateFrom(input: string | Date | number, options?: DateFromOptions) {
	if(!input) {
		return null
	}

	const inputType = typeof input

	switch(inputType) {
		case 'string':
			const time = options?.forceEndOfDay ? '23:59:59' : '00:00:00'

			input = (input as string).substring(0, 10)

			if(BRDateRegex.test(input)) {
				const [day, month, year] = input.split('/')
		
				return new Date(`${year}-${month}-${day} ${time}`)
			} else if(USDateRegex.test(input)) {
				return new Date(`${input} ${time}`)
			} else if(BRSimplifiedDateRegex.test(input) && (options?.forceCurrentYear === undefined || !!options?.forceCurrentYear)) {
				const [day, month] = input.split('/')
				const currentYear = getYear(new Date())

				return new Date(`${currentYear}-${month}-${day} ${time}`)
			} else {
				return null
			}
		case 'number':
			const instance = new Date(input as number)

			if(isNaN(instance as any)) {
				return null
			}

			return instance
		case 'object':
			if(input instanceof Date) {
				return input
			} else {
				return null
			}
		
		default: return null
	}
}

interface GetWeekDaysProps {
	short?: boolean
}

export function getWeekDays(options?: GetWeekDaysProps) {
	const short = options?.short || false

	const days = []
	const startDate = startOfWeek(new Date(), { weekStartsOn: 0 })

	for(let i = 0; i < 7; i++) {
		const day = addDays(startDate, i)
    	const dayName = format(day, short ? 'EEEEEE' : 'E', { locale: ptBR })
		days.push(dayName)
	}

	return days
}

function isInvalid(this: any) {
	return isNaN(new Date(this).getTime())
}

export function roundDuration(duration: Duration) {
	let { minutes, days } = duration
	const minutesInADay = 24 * 60
	const daysInAMonth = 30

	if(days) {
		const months = Math.round(days / daysInAMonth)
		const remainingDays = days % daysInAMonth

		return {
			months,
			days: remainingDays
		}
	}

	if(minutes) {
		if(minutes > minutesInADay) {
			const days = Math.trunc(Math.trunc(minutes / 60) / 24)
			minutes = minutes - minutesInADay

			return {
				days,
				hours: Math.trunc(minutes / 60),
				minutes: minutes % 60
			}
		}

		if(minutes >= 60) {
			return {
				hours: Math.trunc(minutes / 60),
				minutes: minutes % 60
			}
		}
	}

	return duration
}

export function getDurationBetweenTimes(start: string, end: string): Duration {
	const [hourStart, minuteStart] = start.split(':').map(Number)
	const [hourEnd, minuteEnd] = end.split(':').map(Number)

	const totalStartMinutes = hourStart * 60 + minuteStart
	const totalEndMinutes = hourEnd * 60 + minuteEnd

	return {
		minutes: totalEndMinutes - totalStartMinutes
	}
}

declare global {
    interface Date {
		isInvalid(this: any): boolean
    }
}

Date.prototype.isInvalid = isInvalid
