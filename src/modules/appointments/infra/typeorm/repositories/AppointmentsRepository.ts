import { getRepository, Repository, Raw } from 'typeorm'

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment'
import IAppointmentRepository from '@modules/appointments/Repositories/IAppointmentsRepository'
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO'
import IFindMonthAvailablesDTO from '@modules/appointments/dtos/IFindMonthAvailablesDTO'
import IFindFreeHoursFromProviderDTO from '@modules/appointments/dtos/IFindFreeHoursFromProviderDTO'

class AppointmentsRepository implements IAppointmentRepository {
  private ormRepository: Repository<Appointment>

  constructor() {
    this.ormRepository = getRepository(Appointment)
  }

  public async create({
    provider_id,
    date
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({ provider_id, date })

    await this.ormRepository.save(appointment)

    return appointment
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const appointment = await this.ormRepository.findOne({
      where: { date }
    })

    return appointment
  }

  public async findMonthAvailables({
    provider_id,
    month,
    year
  }: IFindMonthAvailablesDTO): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, '0')

    const Appointments = this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          (dateFieldName) =>
            `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`
        )
      }
    })

    return Appointments
  }

  public async findFreeHoursFromProvider({
    provider_id,
    day,
    month,
    year
  }: IFindFreeHoursFromProviderDTO): Promise<Appointment[]> {
    const parsedDay = String(day).padStart(2, '0')
    const parsedMonth = String(month).padStart(2, '0')

    const Appointments = this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          (dateFieldName) =>
            `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`
        )
      }
    })
    return Appointments
  }
}

export default AppointmentsRepository
