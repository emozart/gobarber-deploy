import { injectable, inject } from 'tsyringe'
import { getDaysInMonth, getDate, getHours } from 'date-fns'

import IAppointmentsRepository from '../Repositories/IAppointmentsRepository'

import IFindFreeHoursFromProviderDTO from '@modules/appointments/dtos/IFindFreeHoursFromProviderDTO'

interface IRequest {
  provider_id: string
  day: number
  month: number
  year: number
}

type IResponse = Array<{
  hour: number
  available: boolean
}>

@injectable()
class ListProvidersDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository
  ) { }

  public async execute({
    provider_id,
    day,
    month,
    year
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findFreeHoursFromProvider(
      {
        provider_id,
        day,
        month,
        year
      }
    )

    const startHour = 8

    const eachHourArray = Array.from(
      { length: 10 },
      (_, index) => index + startHour
    )

    const availability = eachHourArray.map((hour) => {
      const hasAppointmentInHour = appointments.find(
        (appointment) => getHours(appointment.date) === hour
      )

      return { hour, available: !hasAppointmentInHour }
    })

    return availability
  }
}

export default ListProvidersDayAvailabilityService
