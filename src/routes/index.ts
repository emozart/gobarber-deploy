import { Router } from 'express'

import appointmentRouter from './appointmens.routes'
import userRouter from './users.routes'

const routes = Router()

routes.use('/appointments', appointmentRouter)
routes.use('/users', userRouter)

export default routes
