import { getRepository } from 'typeorm'
import { hash } from 'bcryptjs'

import User from '@modules/users/infra/typeorm/entities/User'
import AppError from '@shared/errors/AppError'

interface CreateUserRequest {
  name: string
  email: string
  password: string
}

class CreateUserService {
  async axecute({ name, email, password }: CreateUserRequest): Promise<User> {
    const usersRepository = getRepository(User)

    const checkUserExists = await usersRepository.findOne({ where: { email } })

    if (checkUserExists) {
      throw new Error('This email is already in use.')
    }

    const hashedPassword = await hash(password, 8)

    const user = usersRepository.create({
      name,
      email,
      password: hashedPassword
    })

    await usersRepository.save(user)

    return user
  }
}

export default CreateUserService
