'use client'

import React from 'react'
import { format } from "date-fns";
import Image from "next/image";
import { Heart, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const posts: Post[] = [
	{
		id: 1,
		author: {
			id: 2,
			name: 'Larissa Carvalho',
			image: '/images/girl.png'
		},
		content: 'Hoje o play foi até meia-noite!',
		date: format(new Date(), 'dd/MM/yyyy HH:mm'),
		url: '/images/play.jpg',
		likes: [
			{
				id: 1,
				user: {
					id: 3,
					name: 'Yuri Rego',
					image: '/images/boy.jpg'
				}
			},
			{
				id: 2,
				user: {
					id: 1,
					name: 'Felipe Leite',
					image: '/images/boy.jpg'
				}
			}
		],
		comments: [
			{
				id: 1,
				user: {
					id: 1,
					name: 'Felipe Leite',
					image: '/images/boy.jpg'
				},
				content: 'Foi top demais!',
				date: format(new Date(), 'dd/MM/yyyy HH:mm')
			},
			{
				id: 2,
				user: {
					id: 2,
					name: 'Larissa Carvalho',
					image: '/images/girl.png'
				},
				content: 'Pena que acabou cedo pra mim... =(',
				date: format(new Date(), 'dd/MM/yyyy HH:mm')
			}
		]
	},

	{
		id: 2,
		author: {
			id: 3,
			name: 'Yuri Rego',
			image: '/images/boy.jpg'
		},
		content: 'Raquete nova S2',
		date: format(new Date(), 'dd/MM/yyyy HH:mm'),
		url: ['/images/raquete.jpg', '/images/raquete2.png'],
		likes: [],
		comments: []
	}
]

export default function Timeline() {
	return (
		<ul className="w-full divide-y divide-gray-200/80 border-l-4 border-l-slate-200 dark:border-l-slate-700 px-16 overflow-y-auto">
			{posts.map(post => (
				<li key={post.id} className="flex flex-col gap-4 py-6">
					<div className="flex gap-4 justify-between items-center">
						<div className="flex items-center gap-2 cursor-pointer hover:opacity-80">
							<Avatar>
								<AvatarImage src={post.author.image} />
								<AvatarFallback>{post.author.name[0].toUpperCase()}</AvatarFallback>
							</Avatar>

							<span className="font-semibold">{post.author.name}</span>
						</div>

						<span className="text-xs text-slate-400">{post.date}</span>
					</div>

					{Array.isArray(post.url) && post.url.length > 1 ? (
						<Carousel>
							<CarouselContent>
								{post.url.map(item => (
									<CarouselItem key={item}>
										<Image alt="" width={1000} height={800} src={item} className="w-[29vw] h-[29vw] object-cover rounded-sm" />
									</CarouselItem>
								))}
							</CarouselContent>

							<CarouselPrevious className="cursor-pointer" />
							<CarouselNext className="cursor-pointer" />
						</Carousel>
					) : (
						<Image alt="" width={1000} height={800} src={String(post.url)} className="w-[29vw] h-[29vw] object-cover rounded-sm" />
					)}

					<div>
						{post.content}
					</div>

					<div className="px-1 flex gap-3 items-center">
						<Heart size={20} className="cursor-pointer hover:opacity-70" onClick={() => { }} />

						<MessageCircle size={20} className="cursor-pointer hover:opacity-70" onClick={() => { }} />
					</div>
				</li>
			))}
		</ul>
	)
}
