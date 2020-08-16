import FakeCreateUsersRepository from '@modules/users/Repositories/fakes/FakeUserRepository'
import FakeHashProvider from '@modules/users/providers/HashProviders/fakes/FakeHashProvider'
import CreateUserService from './CreateUserService'
import AppError from '@shared/errors/AppError'
import FakeStorageProvider from '@shared/container/providers/StorageProviders/fakes/FakeStorageProvider'
import UpdateUserAvatarService from './UpdateUserAvatarService'

describe('UpdateUserAvatar', () => {
  it("should be able to update a user's avatar", async () => {
    const fakeUsersRepository = new FakeCreateUsersRepository()
    const fakeStorageProvider = new FakeStorageProvider()

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider
    )

    const newUser = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@exemple.com',
      password: '123456'
    })

    await updateUserAvatar.execute({
      user_id: newUser.id,
      avatarFilename: 'avatar.jpg'
    })

    expect(newUser.avatar).toBe('avatar.jpg')
  })

  it('should not be able to update a avatar of a non existing user', async () => {
    const fakeUsersRepository = new FakeCreateUsersRepository()
    const fakeStorageProvider = new FakeStorageProvider()

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider
    )

    expect(
      updateUserAvatar.execute({
        user_id: 'non-existing-user',
        avatarFilename: 'avatar.jpg'
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should delete old avatar when upload a new one', async () => {
    const fakeUsersRepository = new FakeCreateUsersRepository()
    const fakeStorageProvider = new FakeStorageProvider()

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile')

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider
    )

    const newUser = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@exemple.com',
      password: '123456'
    })

    await updateUserAvatar.execute({
      user_id: newUser.id,
      avatarFilename: 'avatar.jpg'
    })

    await updateUserAvatar.execute({
      user_id: newUser.id,
      avatarFilename: 'avatar_2.jpg'
    })

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg')
    expect(newUser.avatar).toBe('avatar_2.jpg')
  })
})
