import { Router } from 'express'

import appointmentRouter from './appointmens.routes'

const routes = Router()

routes.use('/appointments', appointmentRouter)

export default routes
