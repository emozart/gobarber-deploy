import FakeCreateUsersRepository from '@modules/users/Repositories/fakes/FakeUserRepository'
import ShowProfileService from './ShowProfileService'
import AppError from '@shared/errors/AppError'

let fakeUsersRepository: FakeCreateUsersRepository
let showProfileService: ShowProfileService

describe('ShowUserProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeCreateUsersRepository()
    showProfileService = new ShowProfileService(fakeUsersRepository)
  })

  it('should be able to show the profile.', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@exemple.com',
      password: '123456'
    })

    const profile = await showProfileService.execute({
      user_id: user.id
    })

    expect(profile.name).toBe('John Doe')
    expect(profile.email).toBe('john.doe@exemple.com')
  })

  it('should not be able to show the profile of a non existing user.', async () => {
    await expect(
      showProfileService.execute({
        user_id: 'non-existing-user-id'
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})
