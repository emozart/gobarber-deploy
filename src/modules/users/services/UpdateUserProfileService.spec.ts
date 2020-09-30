import FakeCreateUsersRepository from '@modules/users/Repositories/fakes/FakeUserRepository'
import FakeHashProvider from '@modules/users/providers/HashProviders/fakes/FakeHashProvider'
import CreateUserService from './CreateUserService'
import AppError from '@shared/errors/AppError'
import UpdateUserProfileService from './UpdateUserProfileService'

let fakeUsersRepository: FakeCreateUsersRepository
let fakeHashProvider: FakeHashProvider
let updateUserProfileService: UpdateUserProfileService

describe('UpdateUserProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeCreateUsersRepository()
    fakeHashProvider = new FakeHashProvider()

    updateUserProfileService = new UpdateUserProfileService(
      fakeUsersRepository,
      fakeHashProvider
    )
  })

  it('should not be able to update a non exiting user.', async () => {
    await expect(
      updateUserProfileService.execute({
        user_id: 'non-existing-user',
        name: 'John Trê',
        email: 'john.doe@exemple.com'
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should be able to update profile.', async () => {
    const newUser = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@exemple.com',
      password: '123456'
    })

    const updatedUser = await updateUserProfileService.execute({
      user_id: newUser.id,
      name: 'John Trê',
      email: 'john.tre@exemple.com'
    })

    expect(updatedUser.name).toBe('John Trê')
    expect(updatedUser.email).toBe('john.tre@exemple.com')
  })

  it('should not be able to update with a exitent email.', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@exemple.com',
      password: '123456'
    })

    const newUser = await fakeUsersRepository.create({
      name: 'Teste',
      email: 'teste.teste@teste.com',
      password: '123456'
    })

    await expect(
      updateUserProfileService.execute({
        user_id: newUser.id,
        name: 'John Trê',
        email: 'john.doe@exemple.com'
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should be able to update the password.', async () => {
    const newUser = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@exemple.com',
      password: '123456'
    })

    const updatedUser = await updateUserProfileService.execute({
      user_id: newUser.id,
      name: 'John Trê',
      email: 'john.tre@exemple.com',
      old_password: '123456',
      password: '123123'
    })

    expect(updatedUser.password).toBe('123123')
  })

  it('should not be able to update the password without inform old password', async () => {
    const newUser = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@exemple.com',
      password: '123456'
    })

    await expect(
      updateUserProfileService.execute({
        user_id: newUser.id,
        name: 'John Trê',
        email: 'john.tre@exemple.com',
        password: '123123'
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to update the password with a wrong old password', async () => {
    const newUser = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@exemple.com',
      password: '123456'
    })

    await expect(
      updateUserProfileService.execute({
        user_id: newUser.id,
        name: 'John Trê',
        email: 'john.tre@exemple.com',
        old_password: 'wrong-old-password',
        password: '123123'
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})
