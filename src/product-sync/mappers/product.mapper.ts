import { EProductProvider } from 'src/common/enums/EProductProvider';
import { Product } from '../../products/entities/product.entity';

// Tipos para os dados brutos das APIs (para type safety)
type BrazilianProviderProduct = {
  nome: string;
  descricao: string;
  imagem: string;
  preco: string;
  id: number; // ID do produto no provedor brasileiro
};

type EuropeanProviderProduct = {
  name: string;
  discountValue: number,
  hasDiscount: boolean,
  gallery: string[];
  description: string;
  price: string;
  id: number; // ID do produto no provedor brasileiro
};

export class ProductMapper {
  static brazilianToProduct(dto: BrazilianProviderProduct): Omit<Product, 'id' | 'created_at' | 'updated_at'> {
    return {
      provider: EProductProvider.BRAZILIAN,
      provider_id: dto.id,
      name: dto.nome,
      discountValue: 0,
      hasDiscount: false,
      description: dto.descricao,
      price: parseFloat(dto.preco),
      image: 'https://placehold.co/400x400/a3e635/1f2937?text=' + dto.nome,
      stock: 10, // Valor padrão de estoque
      orderItems: [],
      reviews: [],
    };
  }

  static europeanToProduct(dto: EuropeanProviderProduct): Omit<Product, 'id' | 'created_at' | 'updated_at'> {
    // link para a imagems
    const image = 'https://placehold.co/400x400/a3e635/1f2937?text=' + dto.name;

    return {
      provider: EProductProvider.EUROPEAN,
      provider_id: dto.id,
      name: dto.name,
      discountValue: dto.discountValue,
      hasDiscount: dto.hasDiscount,
      description: dto.description,
      price: parseFloat(dto.price),
      image: image,
      stock: 10, // Valor padrão de estoque
      orderItems: [],
      reviews: [],
    };
  }
}
