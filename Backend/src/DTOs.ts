// Here are written all data type objects
export class registrationDTO {
    username: string
    password: string
    email: string
}

export class changeDTO {
    username: string
    password: string
    newPassword: string
    email: string
    shortToken: string
}

export class authenticationDTO {
    username: string
    password: string
}

export class updateShortTokenDTO {
    longToken: string
}

export class checkShortTokenDTO {
    shortToken: string
}

export class getUserInfoDTO {
    shortToken: string
}

export class getKeyDTO {
    shortToken: string
    key: string
}

export class resetPasswordDTO {
    email: string
}