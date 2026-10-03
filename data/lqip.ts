/**
 * LQIP blur placeholders for the catalog, split out of data/products.ts on
 * purpose. Base64 of WebP barely compresses, so keeping ~5KB of it inside the
 * product records charged it to every module that imports the catalog —
 * including routes and API handlers that never render a product image.
 *
 * Keys are product ids; look them up as PRODUCT_LQIP[product.id].
 */
export const PRODUCT_LQIP: Record<string, string> = {
  "ramraj-cotton-shirt-white": 'data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAACwAwCdASoQABQAPzmEuVOvKKWisAgB4CcJYwAAW+vlOpN+yFiOmAD+iumoUFVIa6rbtDTCDIIjwdjiE82LrBK3+0xe6qZZT5WMJv3QW3GWcGPAAAA=',
  "ramraj-dhoti-set": 'data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAACQAwCdASoQABQAPzmGuVOvKSWisAgB4CcJY2M+Vt+TlcqONZSoAP7pTte9ggJZvBRj6AeWyQQOuRqJgAA=',
  "ramraj-formal-trousers": 'data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAACwAwCdASoQABQAPzmQvlWvKqajMAgB4CcJZQC+SCHfuy8g5fqaIAD+6LO/4/LNydg/YZo7PydDMbfD2v/T7Cz9dRAlqxL79VAAAA==',
  "ramraj-daily-tee": 'data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAACQAwCdASoQABQAPzmEuVOvKKWisAgB4CcJYwAAUlq8K1GHimMAAP7D8QRC0j6T+FDXobhykH8r7ATFv6U1mHDj+mzeZv/DrZvlglAIAAA=',
  "killer-slim-denim-01": 'data:image/webp;base64,UklGRkQAAABXRUJQVlA4IDgAAABQAwCdASoQABQAPzmEuVOvKKWisAgB4CcJaQAASrP9gn9KAAD6lVU7YOJUi+rXCESIMROxOhwIAA==',
  "killer-skinny-black": 'data:image/webp;base64,UklGRnwAAABXRUJQVlA4IHAAAABQBACdASoQABQAPzmEuVOvKKWisAgB4CcJQBOmUFH/AWvYeLz6eRAGdlhsAPyrkfd7pQ3DN/bBz4+LfV31ulXZPLuOf/CoaXD/mVFFBh06GrkOQg2SYk25bo/T2RPq7GAIyfX0AcGvv0NpoqzogAAA',
  "killer-denim-jacket": 'data:image/webp;base64,UklGRnQAAABXRUJQVlA4IGgAAADwAwCdASoQABQAPzmEuVOvKKWisAgB4CcJaQAAW8Oq5DaiLN7UhDlQAP7esdmHDspTjqnxHMAqnW824wZyRq8mpq8NkdU1ErSybEdIIpxFhpAVZfN9nEG4TdP6mY4bAoICEAkUDwAAAA==',
  "killer-cargo-pants": 'data:image/webp;base64,UklGRmgAAABXRUJQVlA4IFwAAADQAwCdASoQABQAPzmEuVOvKKWisAgB4CcJZQAANUuzSHFA93LZfwAA/NAiTLwI+4fyywmUHJjsmsqE1RdB1dY58e6Fz2XY1UK7PFgHoJgJc3++AgJPf6pZNAAAAA==',
  "sportiq-training-tee": 'data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAACwAwCdASoQABQAPzmIuVOvKSWisAgB4CcJZwAAUXh5+Z+Hj/Oa4AD+WtxHD3LCYoeWenG4ik1awBXNG3PVqzrltW2AAA==',
  "sportiq-track-pants": 'data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAAAQBACdASoQABQAPzmGuVOvKSWisAgB4CcJYwCsABuffNFZZKO+FtxJQAD+5yPC6PSO377GzGP/XJhR7ZqU9vQg93RJBVKmqi62VUVfr1GVCE7VG69kakgA',
  "sportiq-gym-shorts": 'data:image/webp;base64,UklGRpoAAABXRUJQVlA4II4AAABQBACdASoQABQAPzmEuVOvKKWisAgB4CcJagCdAYwS4RYdLe7WxqLszBIAAP7mAvbQ6QZKHDJmNfU1iX1Lh/l0hEfMNIz/VOfRdUxZtiODlKoAREg+dLcCAETNPeftO3mjoFF014SDoFYA52JBj85QlyAIrdvSnNnZv0ArnH2y853aMaR0WH1/nYLB4QAA',
  "sportiq-hoodie": 'data:image/webp;base64,UklGRnwAAABXRUJQVlA4IHAAAAAQBACdASoQABQAPzmGuVOvKSWisAgB4CcJQBidP/wGIyGD9uI8y9v+gAD3jB5xSnF7O8I93qbSmrxymq16muutsq/NGyuxRJJfnQbozTWq2HduJ7+NRVAErzpgerJLJW1ccApfMQqG561G4H1pQAAA',
  "ignite-party-shirt": 'data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAACQAwCdASoQABQAPzmEuVOvKKWisAgB4CcJZQCsABX517Ir7JgAAP6zKtgvhUeCaWy6NISEUq85Ug7u+VJF3PVwlIUkcuy24n0oSMhVINOOnvwkANKAAA==',
  "ignite-linen-shirt": 'data:image/webp;base64,UklGRoQAAABXRUJQVlA4IHgAAABQBACdASoQABQAPzmEuVOvKKWisAgB4CcJZACdACPOrobaSKVnzfSmz7MAAP6GRFoEB7H/PBkFBRVXaY/eJRzT/Dhp5hB/NB2cE0T85TenzbNwgLD9RMcAH5fj9jFSl6X0onJ2iI5E//AXvgiVG4TJ1k86xJfZMAA=',
  "ignite-satin-shirt": 'data:image/webp;base64,UklGRmYAAABXRUJQVlA4IFoAAADwAwCdASoQABQAPzmEuVOvKKWisAgB4CcJZQDE2BmTRBC0gv2IUaYAAOIO5QEj1kSf0zxT4PcnEKSruqzWhcmdQ4kLC+PH1inFWNZliY+DLrscV5n/Q2w24AA=',
  "ignite-cargo-shorts": 'data:image/webp;base64,UklGRmgAAABXRUJQVlA4IFwAAACQAwCdASoQABQAPzmIvlSvKSajMAgB4CcJYwCdACHEc878ECOAAP7DJ6vXIaoloY4gVCfzFwdojtp4WVXq/gCb9L+9KKJEyhEKxDd549mtqPeoxX18C6cTUUNIAA==',
  "jockey-boxer-pack": 'data:image/webp;base64,UklGRrIAAABXRUJQVlA4IKYAAABQBACdASoQABQAPzmEuVOvKKWisAgB4CcJbACdMoKNmAqRqYfa2SnYCZdoAP6FsG00992PYVRFJLvIgWInvBnK32c4KqFZMPagP6MyJvRFKXDubOe9MRPAkUm3HQppYoEP9ostgNoZIOoREQDWFTyLd5wZGkLvjvBtySACdHuqj/7HmXwM4/KC2r29fGRJB+Hl9yruzoodGBIecjW8cXcGJ8E564AA',
  "jockey-crew-tee": 'data:image/webp;base64,UklGRnQAAABXRUJQVlA4IGgAAADwAwCdASoQABQAPzmGuVOvKSWisAgB4CcJZwAATGFqjLSFuIRlzqqwAP6yJLp6Jc47dQ/Ya0RjRSrcCnrQHATc1WZ7B92uIFa4us3rd7Q2TQ2iT/sF03+bnxCTzYrpUnhdCOyV9UQEAA==',
  "jockey-track-pants": 'data:image/webp;base64,UklGRmYAAABXRUJQVlA4IFoAAAAQBACdASoQABQAPzmGulOvKSWisAgB4CcJYgCdH8AJW4N3qTG7DXuXIADN4EuKf2gegZfech7K697i5qFjDT8qY+QocKYAZl3/V8aevyMIJy6rKm3yUimIAAA=',
  "jockey-polo": 'data:image/webp;base64,UklGRmoAAABXRUJQVlA4IF4AAAAQBACdASoQABQAPzmGuVOvKSWisAgB4CcJZQDE2BjrX/fXw6hk1WvRCAD93drtyjmTRL5Gu6YwfIDpLKLMGIJ4kLBSzhrS75F89e/pAlLaMwQcpR8ZZlIObPiaAAAA',
  "unibro-vest-pack": 'data:image/webp;base64,UklGRmgAAABXRUJQVlA4IFwAAAAwBACdASoQABQAPzmGuVOvKSWisAgB4CcJZgCdMoR4GCmy3Dr+s0JX/YAA/t6TLt6nBSP9mrUybYRFlAA6VTMKD+/+d+pIhRO+IurOLGkfQ6hjvwAm2ijvyCQAAA==',
  "unibro-lounge-set": 'data:image/webp;base64,UklGRmgAAABXRUJQVlA4IFwAAACwAwCdASoQABQAPzmGuVOvKSWisAgB4CcJaQAAW+hfAucR3J+QAAD+6o4VQCi585+6nKVeR+B3QsUYLRmKwm41FnOmFiowmE03utqBY6LRbR/2xfdELZenaAAAAA==',
  "unibro-winter-cap": 'data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAAAQBACdASoQABQAPzmEuVOvKKWisAgB4CcJZwC+SCHgAJGevp5ZsIj2AAD+UXiOc9JT7ZTc35xTLWiNA4kT7tSheI6woEah/JIKRwPNFJYwtC0AAAA=',
  "unibro-socks-5": 'data:image/webp;base64,UklGRmYAAABXRUJQVlA4IFoAAABQAwCdASoQABQAPzmEuVOvKKWisAgB4CcJYgAALT5KBWOuuADw2j9FZLtmHYkysy5cSR/SfGMW/1cyQRozcMjvm1zLS30vC/c3TGM/Bd+84G7P20pCv0swAAA=',
  "killer-relaxed-taper": 'data:image/webp;base64,UklGRnIAAABXRUJQVlA4IGYAAACwAwCdASoQABQAPzmEuVOvKKWisAgB4CcJZQDKABTGmRZBWiw/AAD+jTqgGganfprbCACs+lnA4Hi0JcyVNo3cB5hI+t9VqJGKnhZ4eSBNB21SEqV4Sc7M8gnswNBMs2w05tJF8AA=',
  "ravya-blazer-navy": 'data:image/webp;base64,UklGRmwAAABXRUJQVlA4IGAAAAAQBACdASoQABQAPzmEuVOvKKWisAgB4CcJYwDCgB0liQXmsG/3IcCDAADiIO0sh88SbNb/q7BO737EaUR7eezMb79zRDRDZ4aY8nsHEq3thvKpPFjGHLDc97/aMygGEAA=',
  "ravya-bandhgala": 'data:image/webp;base64,UklGRmoAAABXRUJQVlA4IF4AAADQAwCdASoQABQAPzmEuVOvKKWisAgB4CcJYgCdMoGv/7oAAiP8NwAA/hOUJT2quB1vYuiPEVoa5u9kyktuhx3IfgO6X1AT/4GlXCZb6h/0cJ7DKTW/CPacBgCBAAAA',
  "ravya-windcheater": 'data:image/webp;base64,UklGRmgAAABXRUJQVlA4IFwAAAAQBACdASoQABQAPzmGuVOvKSWisAgB4CcJbACdMoADTFsQZRGjaBGxAAD+w1K8+F7MYDL2DnYiweB0f6oAvgn6OKv5jaYSrzNKMYtjCAKPrBWk4LissFqhGgAAAA==',
  "ravya-tote": 'data:image/webp;base64,UklGRnYAAABXRUJQVlA4IGoAAADwAwCdASoQABQAPzmEuVOvKKWisAgB4CcJbACdMoADTe7z5G96gl8+AP7piL0OKrfFOm93yhLbRCkaeWkAt34ZjBykfWnEqRI5/fi0kwqXKuEjP0wkLGMvgMF63GDjIapTeQToblQX0AAA',
};
