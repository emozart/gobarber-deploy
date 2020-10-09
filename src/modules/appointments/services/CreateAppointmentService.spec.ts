import FakeCreateAppointmentsRepository from '../Repositories/fakes/FakeAppointmentsRepository'
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository'
import CreateAppointmentService from './CreateAppointmentService'
import AppError from '@shared/errors/AppError'

let fakeNotificationsRepository: FakeNotificationsRepository
let fakeAppointmentsRepository: FakeCreateAppointmentsRepository
let createAppointment: CreateAppointmentService

describe('CreateAppointmentService', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeCreateAppointmentsRepository()
    fakeNotificationsRepository = new FakeNotificationsRepository()
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository
    )
  })

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 9, 4, 12).getTime()
    })

    const appointment = await createAppointment.execute({
      date: new Date(2020, 9, 4, 15),
      user_id: '456',
      provider_id: '123'
    })

    expect(appointment).toHaveProperty('id')
    expect(appointment.provider_id).toBe('123')
  })

  it('should not be able to create two appointments on the same time', async () => {
    const appoitmentDate = new Date(2020, 11, 5, 14)

    await createAppointment.execute({
      date: appoitmentDate,
      user_id: '456',
      provider_id: '123'
    })

    await expect(
      createAppointment.execute({
        date: appoitmentDate,
        user_id: '456',
        provider_id: '123'
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to create an apponitment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 9, 4, 12).getTime()
    })

    await expect(
      createAppointment.execute({
        date: new Date(2020, 9, 4, 10),
        user_id: '456',
        provider_id: '123'
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to create an apponitment with the same person to provider and user', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 9, 4, 12).getTime()
    })

    await expect(
      createAppointment.execute({
        date: new Date(2020, 9, 4, 15),
        user_id: '123',
        provider_id: '123'
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to create an apponitment before 8hs and after 18hs', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 9, 4, 12).getTime()
    })

    await expect(
      createAppointment.execute({
        date: new Date(2020, 9, 5, 7),
        user_id: 'user-id',
        provider_id: 'provider-id'
      })
    ).rejects.toBeInstanceOf(AppError)

    await expect(
      createAppointment.execute({
        date: new Date(2020, 9, 5, 19),
        user_id: 'user-id',
        provider_id: 'provider-id'
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})
