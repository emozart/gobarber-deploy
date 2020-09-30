import { injectable, inject } from 'tsyringe'
import { isAfter, addHours } from 'date-fns'

import IUserRepository from '@modules/users/Repositories/IUsersRepository'
import IUserTokensRepository from '@modules/users/Repositories/IUserTokensRepository'
import IHashProvider from '@modules/users/providers/HashProviders/models/IHashProvider'
import AppError from '@shared/errors/AppError'

interface IRequest {
  token: string
  password: string
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,

    @inject('UserTokensRepository')
    private userTokenRepository: IUserTokensRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) { }

  async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.userTokenRepository.findByToken(token)

    if (!userToken) {
      throw new AppError('User Token does not exists')
    }

    const user = await this.usersRepository.findById(userToken?.user_id)

    if (!user) {
      throw new AppError('User does not exists')
    }

    const tokenCreatedAt = userToken.createdAt
    const checkDate = addHours(tokenCreatedAt, 2)

    if (isAfter(Date.now(), checkDate)) {
      throw new AppError('Token is expired')
    }

    user.password = await this.hashProvider.genereteHash(password)

    await this.usersRepository.save(user)
  }
}

export default ResetPasswordService
