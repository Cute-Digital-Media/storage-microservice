import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dtos";
import { IsInt, IsNotEmpty } from "class-validator";

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty({
        description: 'ID del usuario a actualizar',
        example: 1
    })
    @IsInt()
    @IsNotEmpty()
    id: number;
}
