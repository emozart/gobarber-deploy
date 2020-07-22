import { getRepository } from 'typeorm'
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

import User from '@modules/users/infra/typeorm/entities/User'
import authConfig from '@config/auth'
import AppError from '@shared/errors/AppError'

interface AuthRequest {
  email: string
  password: string
}

interface AuthResponse {
  user: User
  token: string
}

class AuthenticateUserService {
  public async execute({
    email,
    password
  }: AuthRequest): Promise<AuthResponse> {
    const userRepository = getRepository(User)
    const user = await userRepository.findOne({ where: { email } })

    if (!user) {
      throw new AppError('Email or password does not match.', 401)
    }

    const passwordMatched = await compare(password, user.password)

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
