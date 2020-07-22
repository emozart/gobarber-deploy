import { Router } from 'express'

import appointmentRouter from '@modules/appointments/infra/http/routes/appointmens.routes'
import userRouter from '@modules/users/infra/http/routes/users.routes'
import sessionRouter from '@modules/users/infra/http/routes/session.routes'

const routes = Router()

routes.use('/appointments', appointmentRouter)
routes.use('/users', userRouter)
routes.use('/sessions', sessionRouter)

export default routes
