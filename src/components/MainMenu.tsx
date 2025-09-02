import React from 'react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@radix-ui/react-accordion";
import { Calendar, ChevronDownIcon, File, Home, Plus, Search } from "lucide-react";
import Link from "next/link";

export default function MainMenu() {
	return (
		<aside className="w-56 bg-white dark:bg-slate-950 border-r border-r-slate-300 dark:border-r-slate-700 pt-8 text-sm">
			<Link 
				className="hover:bg-white/10 p-3 cursor-pointer items-center gap-2 w-full flex"
				href="/"
			>
				<Home size={16} />
				Início
			</Link>

			<Accordion type="multiple" className="w-full">
				<AccordionItem value="tournaments">
					<AccordionTrigger className="hover:bg-white/10 p-3 cursor-pointer items-center gap-2 w-full flex justify-between">
						<div className="flex items-center gap-2">
							<Calendar size={16} />
							Eventos
						</div>

						<ChevronDownIcon size={16} className="dark:text-white" />
					</AccordionTrigger>

					<AccordionContent className="px-3 pb-2 pl-7">
						<ul>
							<li>
								<Link href="/event/add" className="p-2 rounded-md hover:bg-white/10 flex gap-2 items-center">
									<Plus size={16} />
									Cadastrar um evento
								</Link>
							</li>

							<li>
								<Link href="/event/search" className="p-2 rounded-md hover:bg-white/10 flex gap-2 items-center">
									<Search size={16} />
									Buscar eventos
								</Link>
							</li>
						</ul>
					</AccordionContent>
				</AccordionItem>
			</Accordion>

			<Accordion type="multiple" className="w-full">
				<AccordionItem value="tournaments">
					<AccordionTrigger className="hover:bg-white/10 p-3 cursor-pointer items-center gap-2 w-full flex justify-between">
						<div className="flex items-center gap-2">
							<File size={16} />
							Relatórios
						</div>

						<ChevronDownIcon size={16} className="dark:text-white" />
					</AccordionTrigger>

					<AccordionContent className="px-3 pb-2 pl-7">
						<ul>
							<li>
								<Link href="/" className="p-2 rounded-md hover:bg-white/10 flex gap-2 items-center">
									<File size={16} />
									Relatório geral
								</Link>
							</li>

							<li>
								<Link href="/" className="p-2 rounded-md hover:bg-white/10 flex gap-2 items-center">
									<File size={16} />
									Participantes / evento
								</Link>
							</li>
						</ul>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</aside>
	)
}
