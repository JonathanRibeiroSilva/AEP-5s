import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ColetaService } from './coleta.service';
import { CreateColetaDto } from './dto/create-coleta.dto';
import { UpdateColetaDto } from './dto/update-coleta.dto';
import { FilterColetaDto } from './dto/filter-coleta.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../user/entities/user.entity';

@Controller('coleta')
export class ColetaController {
    constructor(private readonly coletaService: ColetaService) {}

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    create(@Body() createColetaDto: CreateColetaDto) {
        return this.coletaService.create(createColetaDto);
    }

    @Get()
    findAll(@Query() filters: FilterColetaDto) {
        if (Object.keys(filters).length > 0) {
            return this.coletaService.findByFilters(filters);
        }
        return this.coletaService.findAll();
    }

    @Get('bairros')
    getBairros() {
        return this.coletaService.getBairrosDisponiveis();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.coletaService.findOne(+id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    update(@Param('id') id: string, @Body() updateColetaDto: UpdateColetaDto) {
        return this.coletaService.update(+id, updateColetaDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    remove(@Param('id') id: string) {
        return this.coletaService.remove(+id);
    }
}
