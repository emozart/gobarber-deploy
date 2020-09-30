import FakeUsersRepository from '@modules/users/Repositories/fakes/FakeUserRepository'
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider'
import FakeUserTokensRepository from '@modules/users/Repositories/fakes/FakeUserTokenRepository'
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService'
import AppError from '@shared/errors/AppError'

let fakeUsersRepository: FakeUsersRepository
let fakeMailProvider: FakeMailProvider
let fakeUserTokensRepository: FakeUserTokensRepository
let sendForgotPasswordEmail: SendForgotPasswordEmailService

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeMailProvider = new FakeMailProvider()
    fakeUserTokensRepository = new FakeUserTokensRepository()

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository
    )
  })

  it('should be able to recover your password using your email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail')

    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@exemple.com',
      password: '123456'
    })

    await sendForgotPasswordEmail.execute({ email: 'john.doe@exemple.com' })

    expect(sendMail).toHaveBeenCalled()
  })

  it('should be able to recover a non existing user password', async () => {
    await expect(
      sendForgotPasswordEmail.execute({ email: 'john.doe@exemple.com' })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should generate a forgot password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate')

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@exemple.com',
      password: '123456'
    })

    await sendForgotPasswordEmail.execute({ email: 'john.doe@exemple.com' })

    expect(generateToken).toHaveBeenCalledWith(user.id)
  })
})
