"use client"

import * as React from "react"
import { ReactNode } from 'react'
import { cn } from "@/lib/utils"
import Image from "next/image"

type UploadProps = Omit<React.ComponentProps<"div">, "children"> & 
	{ 
		value: string
		children: (props: { 
			image: File | null,
			value: string
		}) => ReactNode
	}

function Upload({ className, children, value, ...props }: UploadProps) {
	const [image, setImage] = React.useState<null | File>(null)

	return (
		<div
			className={cn('flex flex-col items-center w-full h-80 relative', className) }
			{...props}
		>
			{children({ image, value })}

			<input 
				id={value} 
				type="file" 
				className="hidden" 
				onChange={e => {
					setImage(e.target.files?.[0] || null)
				}} 
			/>
		</div>
	)
}

function UploadTrigger({ className, value, children, file, ...props }: React.ComponentProps<"label"> & { value: string, file: File | null }) {
	return (
		<label
			className={cn("absolute top-0 cursor-pointer shadow-xs h-full w-full text-sm flex flex-col justify-center items-center px-8 py-4 rounded-md border-1 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors text-slate-500", className)}
			htmlFor={value}
			{...props}
		>
			{file ? (
				<div className="flex flex-col gap-4 items-center text-white">
					<span>Alterar arquivo</span>
					<span className="text-xs">{file.name} ({Math.round(file.size / 1024)} KB)</span>
				</div>
			) : children}
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
			<Image src={url} alt="" width={500} height={500} className="object-cover object-center rounded-md opacity-50 w-full h-full" />
		</div>
	)
}

export { Upload, UploadTrigger, UploadViewer }