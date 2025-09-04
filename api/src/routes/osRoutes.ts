import { Router } from 'express'

import { osController } from '../controllers/OSController'
import { checkUpload, uploadMinio } from '../config/multer'

export const osRoutes = Router()

osRoutes.get('/', osController.index)
osRoutes.get('/filter', osController.filter)
osRoutes.get('/:id/files', osController.loadOSFiles)

osRoutes.get('/count_by_status', osController.countByStatus)
osRoutes.get('/count_by_date', osController.countByDate)
osRoutes.get('/count_by_city', osController.countByCity)

osRoutes.get('/:id', osController.show)
osRoutes.post('/', osController.create)
osRoutes.patch('/:id/execute', osController.execute)
osRoutes.patch('/:id/finish', osController.finish)
osRoutes.patch('/:id/revert', osController.revert)
osRoutes.put('/:id', osController.update)
osRoutes.delete('/:id', osController.delete)
osRoutes.post('/file', uploadMinio.single('file'), checkUpload, osController.uploadFile)
osRoutes.delete('/file/:id/remove', osController.removeFile)
osRoutes.get('/check_number/:number', osController.checkNumberAvailability)
osRoutes.patch('/:id/start', osController.start)
osRoutes.patch('/:id/recover', osController.recover)