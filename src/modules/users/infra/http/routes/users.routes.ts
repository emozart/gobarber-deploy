import { Router } from 'express'
import { celebrate, Joi, Segments } from 'celebrate'

import multer from 'multer'
import uploadConfig from '@config/upload'

import UsersController from '../controllers/UsersController'
import UserAvatarController from '../controllers/UserAvatarController'
import ensureAthenticated from '../middlewares/ensureAuthenticated'

const usersRouter = Router()
const upload = multer(uploadConfig)
const usersController = new UsersController()
const userAvatarController = new UserAvatarController()

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      nome: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required()
    }
  }),
  usersController.create
)

usersRouter.patch(
  '/avatar',
  ensureAthenticated,
  upload.single('avatar'),
  userAvatarController.update
)

export default usersRouter
