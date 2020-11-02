interface IMailConfig {
  driver: 'ethereal' | 'ses'

  defaults: {
    from: {
      email: string
      name: string
    }
  }
}

export default {
  driver: process.env.MAIL_DRIVER || 'etherial',

  defaults: {
    from: {
      email: 'contato@softbit.com.br',
      name: 'Equipe Softbit'
    }
  }
} as IMailConfig
