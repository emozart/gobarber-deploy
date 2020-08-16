import { sign } from 'jsonwebtoken'
import { injectable, inject } from 'tsyringe'

import User from '@modules/users/infra/typeorm/entities/User'
import authConfig from '@config/auth'
import AppError from '@shared/errors/AppError'
import IUserRepository from '@modules/users/Repositories/IUsersRepository'
import IHashProvider from '@modules/users/providers/HashProviders/models/IHashProvider'

interface IAuthRequest {
  email: string
  password: string
}

interface IAuthResponse {
  user: User
  token: string
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) { }

  public async execute({
    email,
    password
  }: IAuthRequest): Promise<IAuthResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new AppError('Email or password does not match.', 401)
    }

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      user.password
    )

    if (!passwordMatched) {
      throw new AppError('Email or password does not match.', 401)
    }

    const { secret, expiresIn } = authConfig.jwt

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn
    })

    return { user, token }
  }
}

export default AuthenticateUserService
