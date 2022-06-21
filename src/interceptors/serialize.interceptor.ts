import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { ClassConstructor, plainToClass } from "class-transformer";
import { map, Observable } from "rxjs";

export function Serialize(dto: ClassConstructor<any>): any {
    return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {

    constructor(private dto: any) {}

    intercept (context: ExecutionContext, handler: CallHandler): Observable<any> {
        // run something before a request is handled by the request handler

        return handler.handle().pipe(
            map((data: any) => {
                return plainToClass(this.dto as ClassConstructor<any>, data, {
                    // remove fields that are not specified in the DTO.
                    excludeExtraneousValues: true,
                })
            })
        )
    }
}