import { uuid } from 'uuidv4'
import { isEqual, getMonth, getYear, getDate } from 'date-fns'

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment'
import IAppointmentRepository from '@modules/appointments/Repositories/IAppointmentsRepository'
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO'
import IFindMonthAvailablesDTO from '@modules/appointments/dtos/IFindMonthAvailablesDTO'
import IFindFreeHoursFromProviderDTO from '@modules/appointments/dtos/IFindFreeHoursFromProviderDTO'

class AppointmentsRepository implements IAppointmentRepository {
  private appointments: Appointment[] = []

  public async create({
    provider_id,
    date
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment()

    Object.assign(appointment, { id: uuid(), provider_id, date })

    this.appointments.push(appointment)

    return appointment
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = this.appointments.find((appointment) =>
      isEqual(appointment.date, date)
    )

    return findAppointment
  }

  public async findMonthAvailables({
    provider_id,
    month,
    year
  }: IFindMonthAvailablesDTO): Promise<Appointment[]> {
    const Appointments = this.appointments.filter((appointment) => {
      return (
        appointment.provider_id === provider_id &&
        getMonth(appointment.date) === month - 1 &&
        getYear(appointment.date) === year
      )
    })

    return Appointments
  }

  public async findFreeHoursFromProvider({
    provider_id,
    day,
    month,
    year
  }: IFindFreeHoursFromProviderDTO): Promise<Appointment[]> {
    const Appointments = this.appointments.filter((appointment) => {
      return (
        appointment.provider_id === provider_id &&
        getMonth(appointment.date) === month - 1 &&
        getYear(appointment.date) === year &&
        getDate(appointment.date) === day
      )
    })
    return Appointments
  }
}

export default AppointmentsRepository
