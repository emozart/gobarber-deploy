import { injectable, inject } from 'tsyringe'

import Appointment from '../infra/typeorm/entities/Appointment'
import IAppointmentsRepository from '../Repositories/IAppointmentsRepository'
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'

interface IRequest {
  provider_id: string
  day: number
  month: number
  year: number
}

@injectable()
class ListProvidersAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('CacheProvider')
    private CacheProvider: ICacheProvider
  ) { }

  public async execute({
    provider_id,
    day,
    month,
    year
  }: IRequest): Promise<Appointment[]> {
    const cachekey = `provider-appointments:${provider_id}:${year}-${month}-${day}`

    let appointments = await this.CacheProvider.recover<Appointment[]>(
      'ornintorrinco'
    )

    if (!appointments) {
      appointments = await this.appointmentsRepository.findFreeHoursFromProvider(
        {
          provider_id,
          day,
          year,
          month
        }
      )

      await this.CacheProvider.save(cachekey, appointments)
    }

    return appointments
  }
}

export default ListProvidersAppointmentsService
