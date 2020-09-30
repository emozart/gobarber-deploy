import FakeAppointmentsRepository from '@modules/appointments/Repositories/fakes/FakeAppointmentsRepository'
import ListProvidersMonthAvailabilityService from './ListProvidersMonthAvailabilityService'
import AppError from '@shared/errors/AppError'

let fakeAppointmentsRepository: FakeAppointmentsRepository
let listProvidersMonthAvailabilityService: ListProvidersMonthAvailabilityService

describe('ListProvidersMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository()
    listProvidersMonthAvailabilityService = new ListProvidersMonthAvailabilityService(
      fakeAppointmentsRepository
    )
  })

  it('should be able to list of the provider month availability.', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      date: new Date(2020, 10, 9, 8, 0, 0)
    })

    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      date: new Date(2020, 10, 9, 9, 0, 0)
    })

    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      date: new Date(2020, 10, 9, 10, 0, 0)
    })

    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      date: new Date(2020, 10, 9, 11, 0, 0)
    })

    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      date: new Date(2020, 10, 9, 12, 0, 0)
    })

    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      date: new Date(2020, 10, 9, 13, 0, 0)
    })

    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      date: new Date(2020, 10, 9, 14, 0, 0)
    })

    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      date: new Date(2020, 10, 9, 15, 0, 0)
    })

    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      date: new Date(2020, 10, 9, 16, 0, 0)
    })

    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      date: new Date(2020, 10, 9, 17, 0, 0)
    })

    const availability = await listProvidersMonthAvailabilityService.execute({
      provider_id: 'user',
      year: 2020,
      month: 11
    })

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 8, available: true },
        { day: 9, available: false },
        { day: 10, available: true }
      ])
    )
  })
})
