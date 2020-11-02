import FakeCreateUsersRepository from '@modules/users/Repositories/fakes/FakeUserRepository'
import FakeHashProvider from '@modules/users/providers/HashProviders/fakes/FakeHashProvider'
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider'
import CreateUserService from './CreateUserService'
import AppError from '@shared/errors/AppError'

let fakeUsersRepository: FakeCreateUsersRepository
let fakeHashProvider: FakeHashProvider
let fakeCacheProvider: FakeCacheProvider
let createUser: CreateUserService

describe('CreateUserService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeCreateUsersRepository()
    fakeHashProvider = new FakeHashProvider()
    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider
    )
  })

  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'john.doe@exemple.com',
      password: '123456'
    })

    expect(user).toHaveProperty('id')
  })

  it('should not be able to create two users with the same e-mail', async () => {
    await createUser.execute({
      name: 'John Doe',
      email: 'john.doe@exemple.com',
      password: '123456'
    })

    expect(
      createUser.execute({
        name: 'John Doe',
        email: 'john.doe@exemple.com',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})
