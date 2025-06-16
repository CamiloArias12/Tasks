export enum STATUS_CLIENT {
  INACTIVE = 'inactivo',
  ACTIVE = 'inactivo',
}

export enum ROLES {
  USER = 'user',
  ADMIN = 'admin',
}

export enum REGISTER_ROLE {
  // TODO: Find a way to create enum with number and use zod to received string and convert to int
  USER = '1',
  ADMIN = '2',
}
