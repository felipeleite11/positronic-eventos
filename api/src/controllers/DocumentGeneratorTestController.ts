import { Request, Response } from 'express'
import { TDocumentDefinitions } from 'pdfmake/interfaces'
// @ts-ignore
import Xlsx from 'xlsx-populate'

import { prepareErrorResponse } from '../utils/express-response-prepare'

class DocumentGeneratorTestController {
	async pdf(req: Request, res: Response) {
		try {
			const docDefinitions: TDocumentDefinitions = {
				defaultStyle: {
					font: 'Roboto',
					fontSize: 12
				},
		
				header: function() {
					return [
						{
							canvas: [{ type: 'line', x1: 30, y1: 0, x2: 566, y2: 0, lineWidth: 0.5, lineColor: '#777' }]
						},
						{
							columns: [
								{
									text: `Data de emissão:`,
									margin: [30, 4, 0, 0],
									fontSize: 9
								}, {
									text: `Emitido por: Felipe Leite`,
									margin: [0, 4, 30, 0],
									fontSize: 9,
									alignment: 'right'
								}
							]
						},
						{
							canvas: [{ type: 'line', x1: 30, y1: 4, x2: 566, y2: 4, lineWidth: 0.5, lineColor: '#777' }]
						}
					]
				},
		
				content: [
					{
						text: 'TESTE',
						fontSize: 18,
						alignment: 'center',
						margin: [0, 140, 0, 30]
					}
				],
		
				footer: function(currentPage, pageCount) { 
					return [
						{
							canvas: [{ type: 'line', x1: 30, y1: -16, x2: 564, y2: -16, lineWidth: 0.5, lineColor: '#777' }]
						},
						{
							style: 'footer',
							columns: [
								{ 
									text: 'Integrare O.S. - Robot Genesis', 
									alignment: 'left', 
									style: 'footer'
								},
								{ 
									text: `${currentPage} de ${pageCount}`, 
									alignment: 'right',
									style: 'footer' 
								}
							]
						},
						{
							canvas: [{ type: 'line', x1: 0, y1: 22, x2: 624, y2: 22, lineWidth: 10, lineColor: '#1f6b3d' }]
						}
					]
				},
		
				styles: {
					header_title: {
						fontSize: 14
					},
					paragraph: {
						fontSize: 11,
						margin: [0, 16, 0, 16],
						lineHeight: 2
					},
					footer: {
						alignment: 'center',
						fontSize: 10,
						color: '#777',
						margin: [15, -2, 15, 0]
					}
				},
		
				images: {
					logo: `${process.env.REACT_APP_IP_ADDRESS}/images/integrare-dark.png`,
					calendar: `${process.env.REACT_APP_IP_ADDRESS}/images/calendario.png`,
					sort: `${process.env.REACT_APP_IP_ADDRESS}/images/ordenacao.png`,
					user: `${process.env.REACT_APP_IP_ADDRESS}/images/usuario.png`,
				},
		
				pageSize: 'A4',
				pageOrientation: 'portrait',
				pageMargins: [30, 84, 30, 30]
			}

			return res.json(docDefinitions)
		} catch(e) {
			return prepareErrorResponse(e as Error, res)
		}
	}

	async xlsx(req: Request, res: Response) {
		try {
			const wb = await Xlsx.fromBlankAsync()

			const ws = wb.addSheet('Tab 1')

			const cell = ws.cell('A1')

			cell.style('fill', 'FF0000')

			cell.value('teste')
			
			cell.style({ bold: true, fontColor: 'ffffff' })

			wb.deleteSheet(0)
			
			const buffer = await wb.outputAsync()

			return res.send(buffer)
		} catch(e) {
			return prepareErrorResponse(e as Error, res)
		}
	}
}

export const documentGeneratorTestController = new DocumentGeneratorTestController()