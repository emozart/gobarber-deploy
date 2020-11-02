import FakeCreateUsersRepository from '@modules/users/Repositories/fakes/FakeUserRepository'
import FakeHashProvider from '@modules/users/providers/HashProviders/fakes/FakeHashProvider'
import AuthenticateUserService from './AuthenticateUserService'
import AppError from '@shared/errors/AppError'

let fakeUsersRepository: FakeCreateUsersRepository
let fakeHashProvider: FakeHashProvider
let authenticateUser: AuthenticateUserService

describe('AuthenticateUserService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeCreateUsersRepository()
    fakeHashProvider = new FakeHashProvider()

    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider
    )
  })
  it('should be able to authenticate', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@exemple.com',
      password: '123456'
    })

    const response = await authenticateUser.execute({
      email: 'john.doe@exemple.com',
      password: '123456'
    })

    expect(response).toHaveProperty('token')
    expect(response.user).toEqual(user)
  })

  it('should not be able to authenticate with an unexisting user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'john.doe@exemple.com',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@exemple.com',
      password: '123456'
    })

    await expect(
      authenticateUser.execute({
        email: 'john.doe@exemple.com',
        password: '654321'
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})
