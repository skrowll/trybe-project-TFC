export const user = {
  validAdmin: {
    id: 1,
    username: 'Admin',
    role: 'admin',
    email: 'admin@admin.com',
    password: '$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW',
  },
  validUser: {
    id: 2,
    username: 'User',
    role: 'user',
    email: 'user@user.com',
    password: '$2a$08$Y8Abi8jXvsXyqm.rmp0B.uQBA5qUz7T6Ghlg/CvVr/gLxYj5UAZVO',
  },
}

export const login = {
  existAdmin: {
    email: 'admin@admin.com',
    password: 'secret_admin',
  },  
  existUser: {
    email: 'user@user.com',
    password: 'secret_user',
  },
  incorrectEmail: {
    email: 'invalid@user.com',
    password: 'senha_invalida',
  },
  incorrectPassword: {
    email: 'user@user.com',
    password: 'senha_invalida',
  },
  empytEmail: {
    email: '',
    password: 'senha_invalida',
  },
  empytPassword: {
    email: 'user@user.com',
    password: '',
  },
}