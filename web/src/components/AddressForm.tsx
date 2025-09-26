'use client'

import { useEffect, useState } from "react"
import { Input } from "./ui/input"
import { useQuery } from "@tanstack/react-query"
import { ibge } from "@/services/ibge"
import { Controller } from "react-hook-form"
import cep, { CEP } from 'cep-promise'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { toast } from "sonner"

interface AddressFormProps {
	formHandlers: any
	onStatesReady?: (states: string[]) => void
	onCitiesReady?: (cities: string[]) => void
}

export function AddressForm({ formHandlers, onStatesReady, onCitiesReady }: AddressFormProps) {
	const { register, formState: { errors }, getValues, control, reset } = formHandlers

	const preselectedState = getValues('state') as string

	const [selectedUF, setSelectedUF] = useState<string | null>(null)
	const [addressData, setAddressData] = useState<Partial<CEP> | null>(null)

	const { data: states } = useQuery<string[]>({
		queryKey: ['get-states'],
		queryFn: async () => {
			const { data: response } = await ibge.get<{ sigla: string }[]>('estados')

			return response.map(item => item.sigla)
		}
	})

	const { data: cities } = useQuery<string[]>({
		queryKey: ['get-cities-by-uf', selectedUF],
		queryFn: async () => {
			const { data: response } = await ibge.get<{ nome: string }[]>(`estados/${selectedUF}/municipios`)

			return response.map(item => item.nome)
		},
		enabled: !!selectedUF
	})

	async function handleSearchByZipcode(zipcode: string) {
		try {
			const response = await cep(zipcode)

			setAddressData(response)

			setSelectedUF(response.state)

			// setAddressData({
			// 	neighborhood: 'Guamá', 
			// 	street: 'Rua X', 
			// 	state: 'PA', 
			// 	city: 'Belém'
			// })

			// setSelectedUF('PA')
		} catch(e: any) {
			toast.error('Houve um erro ao buscar os dados a partir do CEP. Por favor, preencha o endereço manualmente.')
		}
	}

	useEffect(() => {
		if(addressData && cities) {
			const { neighborhood, street, state, city, cep } = addressData

			setTimeout(() => {
				reset({
					...getValues(),
					zipcode: cep,
					state,
					city,
					district: neighborhood,
					street
				})
			}, 80)
		}
	}, [addressData, cities])

	useEffect(() => {
		if(states) {
			onStatesReady?.(states)
		}
	}, [states])

	useEffect(() => {
		if(cities) {
			onCitiesReady?.(cities)
		}
	}, [cities])

	useEffect(() => {
		if(preselectedState) {
			setSelectedUF(preselectedState)
		}
	}, [preselectedState])

	return (
		<div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 w-full">
			<Input
				label="CEP"
				placeholder="00000000"
				{...register("zipcode")}
				onChange={e => {
					const zipcode = e.target.value

					if(zipcode.length === 8) {
						handleSearchByZipcode(zipcode)
					} else {
						reset({
							...getValues(),
							zipcode,
							state: '',
							city: '',
							street: '',
							district: '',
							number: '',
							complement: ''
						})
					}
				}}
				validationMessage={errors.zipcode?.message}
			/>

			<Controller
				name="state"
				control={control}
				render={({ field }) => (
					<Select
						value={field.value}
						onValueChange={value => {
							field.onChange(value)

							setSelectedUF(value)
						}}
					>
						<SelectTrigger
							className="w-full"
							id="state"
							label="UF"
							validationMessage={errors.state?.message ? 'Selecione o estado' : undefined}
						>
							<SelectValue placeholder="Selecione o estado" />
						</SelectTrigger>

						<SelectContent>
							{states?.map(state => (
								<SelectItem key={state} value={state}>{state}</SelectItem>
							))}
						</SelectContent>
					</Select>
				)}
			/>

			<Controller
				name="city"
				control={control}
				render={({ field }) => (
					<Select
						value={field.value}
						onValueChange={value => {
							field.onChange(value)
						}}
					>
						<SelectTrigger
							className="w-full"
							id="city"
							label="Cidade"
							validationMessage={errors.city?.message ? 'Selecione a cidade' : undefined}
						>
							<SelectValue placeholder="Selecione a cidade" />
						</SelectTrigger>

						<SelectContent>
							{cities?.map(city => (
								<SelectItem key={city} value={city}>{city}</SelectItem>
							))}
						</SelectContent>
					</Select>
				)}
			/>

			<Input
				label="Bairro"
				{...register("district")}
				validationMessage={errors.district?.message}
			/>

			<Input
				label="Rua"
				{...register("street")}
				validationMessage={errors.street?.message}
			/>

			<Input
				label="Número"
				{...register("number")}
				validationMessage={errors.number?.message}
			/>

			<Input
				label="Complemento"
				{...register("complement")}
				validationMessage={errors.complement?.message}
			/>
		</div>
	)
}