import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Product } from '../products/entities/product.entity';
import { ProductMapper } from './mappers/product.mapper';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductSyncService implements OnApplicationBootstrap {
  private readonly logger = new Logger(ProductSyncService.name);

  // URLs dos provedores (idealmente viriam de variáveis de ambiente)
  private readonly BRAZILIAN_PROVIDER_URL: string;
  private readonly EUROPEAN_PROVIDER_URL: string;

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.BRAZILIAN_PROVIDER_URL = this.configService.get<string>('apiProvider.providerBR') ?? '';
    this.EUROPEAN_PROVIDER_URL = this.configService.get<string>('apiProvider.providerEU') ?? '';
  }
  async onApplicationBootstrap() {
    this.logger.log('Aplicação iniciada. Executando sincronização inicial...');
    await this.syncAllProviders();
  }

  async syncAllProviders() {
    this.logger.log('Iniciando sincronização de todos os provedores...');
    await this.syncBrazilianProducts();
    await this.syncEuropeanProducts();
    this.logger.log('Sincronização concluída.');
  }

  async syncBrazilianProducts() {
    try {
      this.logger.log('Buscando produtos do provedor brasileiro...');
      // 1. CHAMADA À API
      const response = await firstValueFrom(this.httpService.get(this.BRAZILIAN_PROVIDER_URL));
      const productsFromApi = response.data; // Assumindo que a resposta é um array

      // 2. TRANSFORMAÇÃO
      const transformedProducts = productsFromApi.map(ProductMapper.brazilianToProduct);
      this.logger.log(`${transformedProducts.length} produtos brasileiros transformados.`);

      // 3. PERSISTÊNCIA (UPSERT)
      await this.productRepository.upsert(transformedProducts, ['provider', 'provider_id']);
      this.logger.log('Produtos brasileiros salvos com sucesso.');

    } catch (error) {
      this.logger.error('Falha ao sincronizar provedor brasileiro:', error);
    }
  }

  async syncEuropeanProducts() {
    try {
      this.logger.log('Buscando produtos do provedor europeu...');
      // 1. CHAMADA À API
      const response = await firstValueFrom(this.httpService.get(this.EUROPEAN_PROVIDER_URL));
      const productsFromApi = response.data;

      // 2. TRANSFORMAÇÃO
      const transformedProducts = productsFromApi.map(ProductMapper.europeanToProduct);
      this.logger.log(`${transformedProducts.length} produtos europeus transformados.`);

      // 3. PERSISTÊNCIA (UPSERT)
      await this.productRepository.upsert(transformedProducts, ['provider', 'provider_id']);
      this.logger.log('Produtos europeus salvos com sucesso.');

    } catch (error) {
      this.logger.error('Falha ao sincronizar provedor europeu:', error);
    }
  }
}
