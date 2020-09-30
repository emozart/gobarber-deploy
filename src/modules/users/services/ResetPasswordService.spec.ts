import FakeUsersRepository from '@modules/users/Repositories/fakes/FakeUserRepository'
import FakeUserTokensRepository from '@modules/users/Repositories/fakes/FakeUserTokenRepository'
import FakeHashProvider from '@modules/users/providers/HashProviders/fakes/FakeHashProvider'
import ResetPasswordService from './ResetPasswordService'
import AppError from '@shared/errors/AppError'

let fakeUsersRepository: FakeUsersRepository
let fakeUserTokensRepository: FakeUserTokensRepository
let fakeHashProvider: FakeHashProvider
let resetPasswordService: ResetPasswordService

describe('Reseting Password', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeUserTokensRepository = new FakeUserTokensRepository()
    fakeHashProvider = new FakeHashProvider()

    resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider
    )
  })

  it('should be able to reset the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@exemple.com',
      password: '123456'
    })

    const userToken = await fakeUserTokensRepository.generate(user.id)

    const generateHash = jest.spyOn(fakeHashProvider, 'genereteHash')

    await resetPasswordService.execute({
      password: '123123',
      token: userToken.token
    })

    const updatedUser = await fakeUsersRepository.findById(user.id)

    expect(generateHash).toHaveBeenCalledWith('123123')
    expect(updatedUser?.password).toBe('123123')
  })

  it('should be able to reset a password with a non existing token', async () => {
    await expect(
      resetPasswordService.execute({
        token: 'non-existing-token',
        password: '123123'
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should be able to reset a password with a non existing user', async () => {
    const { token } = await fakeUserTokensRepository.generate(
      'non-existing-user'
    )

    await expect(
      resetPasswordService.execute({
        token,
        password: '123123'
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to reset password after 2 hours from token generation', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@exemple.com',
      password: '123456'
    })

    const { token } = await fakeUserTokensRepository.generate(user.id)

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date()
      return customDate.setHours(customDate.getHours() + 3)
    })

    await expect(
      resetPasswordService.execute({
        token,
        password: '123123'
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})
