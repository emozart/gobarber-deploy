import { Router } from 'express'

import appointmentRouter from './appointmens.routes'
import userRouter from './users.routes'
import sessionRouter from './session.routes'

const routes = Router()

routes.use('/appointments', appointmentRouter)
routes.use('/users', userRouter)
routes.use('/sessions', sessionRouter)

export default routes
