import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import isPlainObject from 'lodash/isPlainObject';
import isArray from 'lodash/isArray';
import transform from 'lodash/transform';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  isSuccess: boolean;
  message: string;
  meta: {
    page: number;
    totalPage: number;
    limit: number;
    perPage: number;
  };
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  private formatItemResponse(item: any) {
    try {
      if (item) {
        const docResp = {
          ...item,
          id: item._id,
        };

        delete docResp._id;
        delete docResp._updatedAt;
        delete docResp._createdAt;

        return transform(docResp, (result, val, key: string) => {
          result[key.charAt(0).toLowerCase() + key.slice(1)] = val;
          if (isArray(val)) {
            result[key.charAt(0).toLowerCase() + key.slice(1)] = val.map(
              (item) => this.formatItemResponse(item),
            );
          } else if (isPlainObject(val)) {
            result[key.charAt(0).toLowerCase() + key.slice(1)] =
              this.formatItemResponse(val);
          } else {
            result[key.charAt(0).toLowerCase() + key.slice(1)] = val;
          }
        });
      }
      return item === undefined ? null : item;
    } catch (error) {
      return item;
    }
  }

  private handleResponse(data: any) {
    const childData = data?.data;

    if (childData && Array.isArray(childData)) {
      const dataResp = [];
      for (const item of childData) {
        dataResp.push(this.formatItemResponse(item));
      }

      return {
        ...data,
        data: dataResp,
      };
    }

    return {
      ...data,
      data: this.formatItemResponse(childData),
    };
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Response<T>> | Promise<Observable<Response<T>>> {
    return next.handle().pipe(map((data) => this.handleResponse(data)));
  }
}
