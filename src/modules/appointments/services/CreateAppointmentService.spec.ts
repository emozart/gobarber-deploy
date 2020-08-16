import FakeCreateAppointmentsRepository from '../Repositories/fakes/FakeAppointmentsRepository'
import CreateAppointmentService from './CreateAppointmentService'
import AppError from '@shared/errors/AppError'

import Appointment from '../infra/typeorm/entities/Appointment'

describe('CreateAppointmentService', () => {
  it('should be able to create a new appointment', async () => {
    const fakeAppointmentsRepository = new FakeCreateAppointmentsRepository()
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository
    )

    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: '123'
    })

    expect(appointment).toHaveProperty('id')
    expect(appointment.provider_id).toBe('123')
  })

  it('should not be able to create two appointments on the same time', async () => {
    const fakeAppointmentsRepository = new FakeCreateAppointmentsRepository()
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository
    )

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
