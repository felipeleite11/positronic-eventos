"use client"

import * as React from "react"
import { ReactNode } from 'react'
import { cn } from "@/lib/utils"
import Image from "next/image"

type UploadProps = Omit<React.ComponentProps<"div">, "children"> & 
	{ 
		id: string
		children: (props: { 
			id: string
		}) => ReactNode
		onFileChange?: (file: File | null) => void
	}

function Upload({ className, children, id, onFileChange, ...props }: UploadProps) {
	const [image, setImage] = React.useState<null | File>(null)

	return (
		<div
			className={cn('flex flex-col items-center w-full h-80 relative', className) }
			{...props}
		>
			{children({ id })}

			<input 
				id={id}
				name={id} 
				type="file" 
				className="hidden" 
				onChange={e => {
					setImage(e.target.files?.[0] || null)

					onFileChange?.(e.target.files?.[0] || null)
				}} 
			/>
		</div>
	)
}

function UploadTrigger({ className, id, children, file, ...props }: React.ComponentProps<"label"> & { id: string, file: File | null }) {
	return (
		<label
			className={cn(
				'absolute top-0 cursor-pointer shadow-xs h-full w-full text-sm flex flex-col justify-center items-center px-8 py-4 rounded-md border-1 bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-800 text-slate-400 hover:opacity-70 transition-all', 
				{ 'opacity-0': !!file },
				className
			)}
			htmlFor={id}
			{...props}
		>
			{file ? (
				<div className="flex flex-col gap-4 items-center text-slate-600 dark:text-white">
					<span className="font-semibold">Alterar arquivo</span>
					<span className="text-xs">{file.name} ({Math.round(file.size / 1024)} KB)</span>
				</div>
			) : (children || (
				<div className="flex flex-col gap-4 items-center">
					<span>Enviar arquivo</span>
				</div>
			))}
		</label>
	)
}

function UploadViewer({ className, children, file, ...props }: React.ComponentProps<"div"> & { file: File | null }) {
	const url = file ? URL.createObjectURL(file) : null

	if(!url) {
		return null
	}

	return (
		<div
			className={cn("absolute top-0 h-full rounded-md overflow-hidden", className)}
			{...props}
		>
			<Image src={url} alt="" width={500} height={500} className="object-cover object-center rounded-md w-full h-full" />
		</div>
	)
}

export { Upload, UploadTrigger, UploadViewer }