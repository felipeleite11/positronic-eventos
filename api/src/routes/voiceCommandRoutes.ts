import { Router } from 'express'

import { voiceCommandController } from '../controllers/VoiceCommandController'
import { uploadMinio } from '../config/multer'

export const voiceCommandRoutes = Router()

voiceCommandRoutes.post('/', uploadMinio.single('file'), voiceCommandController.recognize)