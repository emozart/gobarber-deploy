import FakeAppointmentsRepository from '@modules/appointments/Repositories/fakes/FakeAppointmentsRepository'
import ListProvidersDayAvailabilityService from './ListProvidersDayAvailabilityService'
import AppError from '@shared/errors/AppError'

let fakeAppointmentsRepository: FakeAppointmentsRepository
let listProvidersDayAvailabilityService: ListProvidersDayAvailabilityService

describe('ListProvidersMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository()
    listProvidersDayAvailabilityService = new ListProvidersDayAvailabilityService(
      fakeAppointmentsRepository
    )
  })

  it('should be able to list of the provider day availability.', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: 'user',
      date: new Date(2020, 10, 9, 14, 0, 0)
    })

    await fakeAppointmentsRepository.create({
      provider_id: 'user',
      user_id: 'user',
      date: new Date(2020, 10, 9, 16, 0, 0)
    })

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 10, 9, 11).getTime()
    })

    const availability = await listProvidersDayAvailabilityService.execute({
      provider_id: 'user',
      year: 2020,
      month: 11,
      day: 9
    })

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 10, available: false },
        { hour: 11, available: false },
        { hour: 14, available: false },
        { hour: 15, available: true },
        { hour: 16, available: false },
        { hour: 17, available: true }
      ])
    )
  })
})
