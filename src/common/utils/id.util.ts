import { BadRequestException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

export function validateObjectId(id: string, message?: string): boolean | null {
  if (!isValidObjectId(id)) {
    throw new BadRequestException(message || 'Invalid object id');
  }

  return true;
}
