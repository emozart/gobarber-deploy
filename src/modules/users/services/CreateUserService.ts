import { getRepository } from 'typeorm'
import { injectable, inject } from 'tsyringe'

import User from '@modules/users/infra/typeorm/entities/User'
import AppError from '@shared/errors/AppError'
import IUserRepository from '@modules/users/Repositories/IUsersRepository'

import IHashProvider from '@modules/users/providers/HashProviders/models/IHashProvider'
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'

interface ICreateUserRequest {
  name: string
  email: string
  password: string
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('CacheProvider')
    private CacheProvider: ICacheProvider
  ) { }

  async execute({ name, email, password }: ICreateUserRequest): Promise<User> {
    const checkUserExists = await this.usersRepository.findByEmail(email)

    if (checkUserExists) {
      throw new AppError('This email is already in use.')
    }

    const hashedPassword = await this.hashProvider.genereteHash(password)

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword
    })

    await this.CacheProvider.invalidatePrefix('providers-list')

    return user
  }
}

export default CreateUserService
