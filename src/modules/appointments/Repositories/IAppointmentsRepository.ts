import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment'
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO'
import IFindMonthAvailblesDTO from '@modules/appointments/dtos/IFindMonthAvailablesDTO'
import IFindFreeHoursFromProviderDTO from '@modules/appointments/dtos/IFindFreeHoursFromProviderDTO'

export default interface IAppointmentsRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>
  findByDate(date: Date, provider_id: string): Promise<Appointment | undefined>
  findMonthAvailables(data: IFindMonthAvailblesDTO): Promise<Appointment[]>
  findFreeHoursFromProvider(
    data: IFindFreeHoursFromProviderDTO
  ): Promise<Appointment[]>
}
