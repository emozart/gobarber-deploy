import { injectable, inject } from 'tsyringe'

import User from '@modules/users/infra/typeorm/entities/User'
import IUserRepository from '@modules/users/Repositories/IUsersRepository'
import IHashProvider from '@modules/users/providers/HashProviders/models/IHashProvider'
import AppError from '@shared/errors/AppError'

interface IUpdateProfileRequest {
  user_id: string
  name: string
  email: string
  password?: string
  old_password?: string
}

@injectable()
class UpdateUserProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) { }

  public async execute({
    user_id,
    name,
    email,
    password,
    old_password
  }: IUpdateProfileRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id)

    if (!user) {
      throw new AppError('User not found')
    }
    const userWithUpdatedEmail = await this.usersRepository.findByEmail(email)

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError('This email is already used by other user.')
    }

    if (password && !old_password) {
      throw new AppError('You need to inform the old_password.')
    }

    if (password && old_password) {
      const checkOldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password
      )

      if (!checkOldPassword) {
        throw new AppError('Old password does not match.')
      }

      user.password = await this.hashProvider.genereteHash(password)
    }

    user.name = name
    user.email = email

    return this.usersRepository.save(user)
  }
}

export default UpdateUserProfileService
