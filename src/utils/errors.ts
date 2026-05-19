export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Recurso no encontrado') {
    super(message, 404);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'No tienes permiso para esta acción') {
    super(message, 403);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'No autorizado') {
    super(message, 401);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'El recurso ya existe') {
    super(message, 409);
  }
}
