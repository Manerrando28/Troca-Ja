# Produtos de demonstração da internet

Em 07/10/2026 foram adicionados 12 produtos ao projeto **Troca Já** no Supabase. O catálogo passou de 8 para 20 registros. Os oito registros existentes foram preservados.

Fonte: [API pública de produtos DummyJSON](https://dummyjson.com/docs/products), destinada a testes e protótipos. Os nomes e as descrições foram adaptados para português. As contas proprietárias são as quatro contas fictícias já presentes no aplicativo; estes registros não representam ofertas de pessoas reais.

As imagens correspondem aos respectivos produtos e são acessadas por URLs HTTPS do CDN do DummyJSON, registradas em `image_url`. Não foi necessário baixar ou enviar fotos ao Storage. As 12 URLs foram verificadas com resposta HTTP de sucesso e tipo de conteúdo de imagem. Como ficam hospedadas na fonte, sua disponibilidade depende desse serviço.

## Arquivos para rastrear e repetir a importação

- [internet-products.json](../supabase/internet-products.json): dados importados, URLs das fotos e link individual da fonte de cada produto.
- [seed-internet.sql](../supabase/seed-internet.sql): importação idempotente. IDs existentes são preservados, inclusive se tiverem sido editados.
- [verify-catalog-images.mjs](../scripts/verify-catalog-images.mjs): consulta as imagens e, quando executado com `.env.local`, verifica a leitura dos produtos pelo mesmo adaptador usado no app.

Com Node 22.18+ ou 24 LTS, na raiz do projeto:

```bash
node --env-file=.env.local scripts/verify-catalog-images.mjs
```

Resultado na implantação: 4 categorias, 20 produtos e 12 novos produtos com imagens. Ana vê 14 produtos disponíveis na Home: seus próprios itens e o tênis indisponível ficam fora dessa lista.

## Produtos adicionados

| Produto | Fonte |
| --- | --- |
| Amazon Echo Plus | [DummyJSON 99](https://dummyjson.com/products/99) |
| Apple AirPods | [DummyJSON 100](https://dummyjson.com/products/100) |
| AirPods Max prata | [DummyJSON 101](https://dummyjson.com/products/101) |
| iPhone 5s | [DummyJSON 121](https://dummyjson.com/products/121) |
| Bola de futebol americano | [DummyJSON 137](https://dummyjson.com/products/137) |
| Bola de beisebol | [DummyJSON 138](https://dummyjson.com/products/138) |
| Luva de beisebol | [DummyJSON 139](https://dummyjson.com/products/139) |
| Bola de basquete | [DummyJSON 140](https://dummyjson.com/products/140) |
| iPad Mini 2021 | [DummyJSON 159](https://dummyjson.com/products/159) |
| Samsung Galaxy Tab S8 Plus | [DummyJSON 160](https://dummyjson.com/products/160) |
| MacBook Pro 14 polegadas | [DummyJSON 78](https://dummyjson.com/products/78) |
| Asus Zenbook Pro Duo | [DummyJSON 79](https://dummyjson.com/products/79) |

O acesso público às tabelas continua limitado à leitura por RLS e permissões SQL. Login, propostas e mensagens permanecem locais.
