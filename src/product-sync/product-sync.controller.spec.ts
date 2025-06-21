import { Test, TestingModule } from '@nestjs/testing';
import { ProductSyncController } from './product-sync.controller';

describe('ProductSyncController', () => {
  let controller: ProductSyncController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductSyncController],
    }).compile();

    controller = module.get<ProductSyncController>(ProductSyncController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
