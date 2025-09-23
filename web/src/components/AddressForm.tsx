'use client'

import { useEffect, useState } from "react"
import { Input } from "./ui/input"
import { useQuery } from "@tanstack/react-query"
import { ibge } from "@/services/ibge"
import { Controller } from "react-hook-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

export function AddressForm<T>({ formHandlers }: any) {
	const { register, formState: { errors }, control } = formHandlers

	const [selectedUF, setSelectedUF] = useState<string | null>(null)

	const { data: ufs } = useQuery<string[]>({
		queryKey: ['get-ufs'],
		queryFn: async () => {
			const { data: response } = await ibge.get<{ sigla: string }[]>('estados')

			return response.map(item => item.sigla)
		}
	})

	const { data: cities, refetch: refetchCities } = useQuery<string[]>({
		queryKey: ['get-cities-by-uf'],
		queryFn: async () => {
			const { data: response } = await ibge.get<{ nome: string }[]>(`estados/${selectedUF}/municipios`)

			return response.map(item => item.nome)
		},
		enabled: !!selectedUF
	})

	useEffect(() => {
		if(selectedUF) {
			refetchCities()
		}
	}, [selectedUF])

	return (
		<div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 w-full">
			<Input
				label="CEP"
				placeholder="00000-000"
				{...register("zipcode")}
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
							{ufs?.map(uf => (
								<SelectItem key={uf} value={uf}>{uf}</SelectItem>
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