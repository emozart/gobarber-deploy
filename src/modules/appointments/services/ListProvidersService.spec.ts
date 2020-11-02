import FakeCreateUsersRepository from '@modules/users/Repositories/fakes/FakeUserRepository'
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider'
import ListProvidersService from './ListProvidersService'

let fakeUsersRepository: FakeCreateUsersRepository
let fakeCacheProvider: FakeCacheProvider
let listProvidersService: ListProvidersService

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeCreateUsersRepository()
    listProvidersService = new ListProvidersService(
      fakeUsersRepository,
      fakeCacheProvider
    )
  })

  it('should be able to show the profile.', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@exemple.com',
      password: '123456'
    })

    const user2 = await fakeUsersRepository.create({
      name: 'John Trê',
      email: 'logged.user@exemple.com',
      password: '123456'
    })

    const LoggedUser = await fakeUsersRepository.create({
      name: 'Logged User',
      email: 'john.doe@exemple.com',
      password: '123456'
    })

    const providers = await listProvidersService.execute({
      user_id: LoggedUser.id
    })

    expect(providers).toEqual([user1, user2])
  })
})
