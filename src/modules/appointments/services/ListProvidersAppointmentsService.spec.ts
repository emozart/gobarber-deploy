import FakeAppointmentsRepository from '@modules/appointments/Repositories/fakes/FakeAppointmentsRepository'
import ListProvidersAppointmentsService from './ListProvidersAppointmentsService'

let fakeAppointmentsRepository: FakeAppointmentsRepository
let listProvidersAppointmentsService: ListProvidersAppointmentsService

describe('ListProvidersAppointmentsService', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository()
    listProvidersAppointmentsService = new ListProvidersAppointmentsService(
      fakeAppointmentsRepository
    )
  })

  it('should be able to list the appointments in a day', async () => {
    const appointment1 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2020, 10, 9, 14, 0, 0)
    })

    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2020, 10, 9, 16, 0, 0)
    })

    const appoitments = await listProvidersAppointmentsService.execute({
      provider_id: 'provider',
      year: 2020,
      month: 11,
      day: 9
    })

    expect(appoitments).toEqual(
      expect.arrayContaining([appointment1, appointment2])
    )
  })
})
