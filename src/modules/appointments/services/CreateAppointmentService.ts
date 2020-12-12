import { startOfHour, isBefore, format } from 'date-fns'
import { injectable, inject } from 'tsyringe'

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment'
import AppError from '@shared/errors/AppError'
import IAppointmentsRepository from '@modules/appointments/Repositories/IAppointmentsRepository'
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository'
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'

interface IRequestDTO {
  provider_id: string
  user_id: string
  date: Date
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,

    @inject('CacheProvider')
    private CacheProvider: ICacheProvider
  ) { }

  public async execute({
    provider_id,
    user_id,
    date
  }: IRequestDTO): Promise<Appointment> {
    const appointmentDate = startOfHour(date)

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError("You can't create an appointment on a past date.")
    }

    if (user_id === provider_id) {
      throw new AppError('User could not be provider in the same appointment.')
    }

    if (appointmentDate.getHours() < 8 || appointmentDate.getHours() > 18) {
      throw new AppError(
        'You could not create an appointment before 8hs or after 18hs.'
      )
    }

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
      provider_id
    )

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked')
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate
    })

    const formattedDate = format(appointmentDate, "dd/MM/yyyy 'às' hh:mm'hs'")

    await this.notificationsRepository.create({
      content: `Novo agendamento para o dia ${formattedDate}`,
      recipient_id: provider_id
    })

    this.CacheProvider.invalidate(
      `provider-appointments:${provider_id}:${format(
        appointmentDate,
        'yyyy-M-d'
      )}`
    )

    return appointment
  }
}

export default CreateAppointmentService
