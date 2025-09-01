import React from 'react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@radix-ui/react-accordion";
import { CalendarDays, ChevronDownIcon, ImageUp, MapPin, Plus, Search, Trophy, Users } from "lucide-react";
import Link from "next/link";

export default function MainMenu() {
	return (
		<aside className="w-72 bg-white dark:bg-slate-950 border-r border-r-slate-300 dark:border-r-slate-700 pt-8">
			<Accordion type="multiple" className="w-full text-sm">
				<AccordionItem value="tournaments">
					<AccordionTrigger className="hover:bg-white/10 p-3 cursor-pointer items-center gap-2 w-full flex justify-between">
						<div className="flex items-center gap-2">
							<Trophy size={16} />
							Torneios
						</div>

						<ChevronDownIcon size={16} className="dark:text-white" />
					</AccordionTrigger>

					<AccordionContent className="px-3 pb-2 pl-7">
						<ul>
							<li>
								<Link href="/" className="p-2 rounded-md hover:bg-white/10 flex gap-2 items-center">
									<Plus size={16} />
									Criar um torneio
								</Link>
							</li>

							<li>
								<Link href="/" className="p-2 rounded-md hover:bg-white/10 flex gap-2 items-center">
									<Search size={16} />
									Buscar torneios
								</Link>
							</li>

							<li>
								<Link href="/" className="p-2 rounded-md hover:bg-white/10 flex gap-2 items-center">
									<CalendarDays size={16} />
									Meus torneios
								</Link>
							</li>
						</ul>
					</AccordionContent>
				</AccordionItem>

				<AccordionItem value="arena">
					<AccordionTrigger className="hover:bg-white/10 p-3 cursor-pointer items-center gap-2 w-full flex justify-between">
						<div className="flex items-center gap-2">
							<MapPin size={16} />
							Arenas
						</div>

						<ChevronDownIcon size={16} className="dark:text-white" />
					</AccordionTrigger>

					<AccordionContent className="px-3 pb-2 pl-7">
						<ul>
							<li>
								<Link href="/" className="p-2 rounded-md hover:bg-white/10 flex gap-2 items-center">
									<Plus size={16} />
									Cadastrar arena
								</Link>
							</li>

							<li>
								<Link href="/places" className="p-2 rounded-md hover:bg-white/10 flex gap-2 items-center">
									<Search size={16} />
									Procurar arenas
								</Link>
							</li>
						</ul>
					</AccordionContent>
				</AccordionItem>

				<AccordionItem value="interaction">
					<AccordionTrigger className="hover:bg-white/10 p-3 cursor-pointer items-center gap-2 w-full flex justify-between">
						<div className="flex items-center gap-2">
							<Users size={16} />
							Social
						</div>

						<ChevronDownIcon size={16} className="dark:text-white" />
					</AccordionTrigger>

					<AccordionContent className="px-3 pb-2 pl-7">
						<ul>
							<li>
								<Link href="/" className="p-2 rounded-md hover:bg-white/10 flex gap-2 items-center">
									<Users size={16} />
									Amigos
								</Link>
							</li>

							<li>
								<Link href="/" className="p-2 rounded-md hover:bg-white/10 flex gap-2 items-center">
									<ImageUp size={16} />
									Postar
								</Link>
							</li>
						</ul>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</aside>
	)
}
