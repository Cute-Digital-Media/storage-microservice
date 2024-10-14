import { Body, Controller, Delete, Get, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dtos';
import { UsersService } from './providers/users.service';

import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { DeleteUserDto } from './dtos/delete-user.dto';
import { Rol } from '../auth/enums/rol.enums';
import { UpdateUserDto } from './dtos/update-user.dto';

import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

@ApiTags('Users') // Agrupar en Swagger
@Controller('users')
export class UsersController {
    constructor(
        private readonly userService: UsersService,
    ) { }

    @Post("create-user")
    // @Roles(Rol.ADMIN)
    // @UseGuards(AccessTokenGuard, RolesGuard)
    @ApiOperation({ summary: 'Crear un nuevo usuario' })
    @ApiResponse({ status: 201, description: 'Usuario creado exitosamente.' })
    @ApiResponse({ status: 400, description: 'Solicitud incorrecta.' })
    @ApiResponse({ status: 403, description: 'No tienes permisos para realizar esta acción.' })
    public async createUser(@Body() createUserDto: CreateUserDto) {
        return await this.userService.createUser(createUserDto,);
    }


    @Get("all")
    @Roles(Rol.ADMIN)
    @UseGuards(AccessTokenGuard, RolesGuard)
    @ApiOperation({ summary: 'Obtener todos los usuarios, solo rol de adminsitrador' })
    @ApiResponse({ status: 200, description: 'Lista de usuarios.' })
    @ApiResponse({ status: 403, description: 'No tienes permisos para realizar esta acción.' })
    public async etAllUsers() {
        return this.userService.getUsers();
    }

    @Delete("delete")
    @Roles(Rol.ADMIN)
    @UseGuards(AccessTokenGuard, RolesGuard)
    @ApiOperation({ summary: 'Eliminar un usuario, solo rol de administrador' })
    @ApiResponse({ status: 200, description: 'Usuario eliminado exitosamente.' })
    @ApiResponse({ status: 400, description: 'Solicitud incorrecta.' })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
    @ApiResponse({ status: 403, description: 'No tienes permisos para realizar esta acción.' })
    public async delete(@Body() deleteUserDto: DeleteUserDto) {
        return this.userService.deleteUser(deleteUserDto);
    }

    @Patch("update-user")
    @Roles(Rol.ADMIN)
    @UseGuards(AccessTokenGuard, RolesGuard)
    @ApiOperation({ summary: 'Actualizar los datos  de un usuario, solo rol de administrador' })
    @ApiResponse({ status: 200, description: 'Rol de usuario actualizado exitosamente.' })
    @ApiResponse({ status: 400, description: 'Solicitud incorrecta.' })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
    @ApiResponse({ status: 403, description: 'No tienes permisos para realizar esta acción.' })
    public async udpateUser(@Body() updateUserDto: UpdateUserDto) {
        return this.userService.updateUser(updateUserDto);
    }
}
