// /src/product-sync/product-sync.controller.ts
import { Controller, Post, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ProductSyncService } from './product-sync.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Product Sync')
@Controller('product-sync')
export class ProductSyncController {
  constructor(private readonly productSyncService: ProductSyncService) { }

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Aciona a sincronização de produtos de todos os provedores' })
  @ApiResponse({ status: 202, description: 'A sincronização foi iniciada com sucesso em segundo plano.' })
  @ApiResponse({ status: 401, description: 'Não autorizado. Token JWT inválido ou ausente.' })
  triggerSync(): { message: string } {
    this.productSyncService.syncAllProviders();

    return { message: 'A sincronização de produtos foi iniciada em segundo plano.' };
  }
}

