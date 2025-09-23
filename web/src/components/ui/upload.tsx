"use client"

import * as React from "react"
import { ReactNode } from 'react'
import { cn } from "@/lib/utils"
import Image from "next/image"
import { extname } from "path"
import { formatFileSize, IMAGE_FORMATS } from "@/util/file"
import { File } from "lucide-react"

type UploadProps = Omit<React.ComponentProps<"div">, "children"> & 
	{ 
		id: string
		children: (props: { 
			id: string
		}) => ReactNode
		onFileChange?: (file: File | null) => void
		validationMessage?: string
	}

function Upload({ className, children, id, onFileChange, validationMessage, ...props }: UploadProps) {
	const [image, setImage] = React.useState<null | File>(null)

	return (
		<>
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
		
			{validationMessage && (
				<span className="text-xs text-yellow-500 mx-1">
					{validationMessage}
				</span>
			)}
		</>
	)
}

function UploadTrigger({ className, id, children, file, ...props }: React.ComponentProps<"label"> & { id: string, file: File | null }) {
	return (
		<label
			className={cn(
				'absolute top-0 cursor-pointer shadow-xs h-full w-full text-sm flex flex-col justify-center items-center px-8 py-4 rounded-md border-1 bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-800 text-slate-400 hover:opacity-90 transition-all', 
				{ 'opacity-0': !!file },
				className
			)}
			htmlFor={id}
			{...props}
		>
			{file ? (
				<div className="flex flex-col gap-4 items-center text-slate-600 dark:text-white">
					<span className="font-semibold">Alterar arquivo</span>
					<span className="text-xs">{file.name}</span>
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
	if(!file) {
		return null
	}
	
	const url = URL.createObjectURL(file)

	const extension = extname(file.name)
	
	if(!IMAGE_FORMATS.includes(extension)) {
		return (
			<div
				className={cn("flex flex-col gap-2 justify-center items-center text-slate-400 absolute top-0 h-full rounded-md overflow-hidden", className)}
				{...props}
			>
				<File size={64} />
				<span className="text-sm">{file.name}</span>
				<span className="text-xs">{formatFileSize(file.size)}</span>
			</div>
		)
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