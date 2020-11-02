import { injectable, inject } from 'tsyringe'
import { classToClass } from 'class-transformer'

import User from '@modules/users/infra/typeorm/entities/User'
import IUserRepository from '@modules/users/Repositories/IUsersRepository'
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'

interface IShowProvidersRequest {
  user_id: string
}

@injectable()
class ListProvidersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUserRepository,

    @inject('CacheProvider')
    private CacheProvider: ICacheProvider
  ) { }

  public async execute({ user_id }: IShowProvidersRequest): Promise<User[]> {
    let users = await this.CacheProvider.recover<User[]>(
      `providers-list:${user_id}`
    )

    if (!users) {
      users = await this.usersRepository.findAllProviders({
        except_user_id: user_id
      })
    }

    await this.CacheProvider.save(`providers-list:${user_id}`, users)

    return classToClass(users)
  }
}

export default ListProvidersService
