import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class IntArrayPipe implements PipeTransform {
  transform(value: string[]) {
    value.forEach((e) => {
      const num = parseInt(e);
      if (typeof num !== 'number')
        throw new BadRequestException(`${e} is a invalid number`);
    });
    return value;
  }
}
