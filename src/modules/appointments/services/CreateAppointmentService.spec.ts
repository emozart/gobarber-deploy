import FakeCreateAppointmentsRepository from '../Repositories/fakes/FakeAppointmentsRepository'
import CreateAppointmentService from './CreateAppointmentService'
import AppError from '@shared/errors/AppError'

let fakeAppointmentsRepository: FakeCreateAppointmentsRepository
let createAppointment: CreateAppointmentService

describe('CreateAppointmentService', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeCreateAppointmentsRepository()
    createAppointment = new CreateAppointmentService(fakeAppointmentsRepository)
  })

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: '123'
    })

    expect(appointment).toHaveProperty('id')
    expect(appointment.provider_id).toBe('123')
  })

  it('should not be able to create two appointments on the same time', async () => {
    const appoitmentDate = new Date()

    await createAppointment.execute({
      date: appoitmentDate,
      provider_id: '123'
    })

    expect(
      createAppointment.execute({
        date: appoitmentDate,
        provider_id: '123'
      })
    ).rejects.toBeInstanceOf(AppError)
  })
})
