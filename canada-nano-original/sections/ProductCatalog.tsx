import { useState } from 'react';
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Star, 
  ChevronDown,
  Package,
  Check
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn, formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ProductDisclaimer } from '@/components/ui-custom/Disclaimer';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { sampleProducts, productCategories } from '@/data/products';
import type { Product } from '@/types';

export function ProductCatalog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'name_asc' | 'featured'>('featured');
  const [, setSelectedProduct] = useState<Product | null>(null);
  const [addedToCart, setAddedToCart] = useState<string | null>(null);
  
  const { addToCart } = useCartStore();

  // Filter and sort products
  const filteredProducts = sampleProducts
    .filter(product => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      
      return matchesSearch && matchesCategory && product.isActive;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'featured':
        default:
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      }
    });

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    setAddedToCart(product.id);
    setTimeout(() => setAddedToCart(null), 2000);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
            <Package className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Product Catalog</span>
          </div>
          <h2 className="font-orbitron text-3xl sm:text-4xl font-bold mb-4">
            Premium <span className="text-primary">Nano Silver</span> Wellness Products
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Premium wellness products featuring ultra-small 3-5nm silver nanoparticles. 
            All products are manufactured under strict quality control standards.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="mb-8">
          <ProductDisclaimer />
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 input-holographic"
            />
          </div>

          {/* Category Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-primary/30 min-w-[150px]">
                <Filter className="w-4 h-4 mr-2" />
                {selectedCategory}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {productCategories.map((category) => (
                <DropdownMenuItem
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    selectedCategory === category && 'bg-primary/10 text-primary'
                  )}
                >
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-primary/30 min-w-[150px]">
                Sort By
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setSortBy('featured')}
                className={cn(sortBy === 'featured' && 'bg-primary/10 text-primary')}
              >
                Featured
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortBy('price_asc')}
                className={cn(sortBy === 'price_asc' && 'bg-primary/10 text-primary')}
              >
                Price: Low to High
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortBy('price_desc')}
                className={cn(sortBy === 'price_desc' && 'bg-primary/10 text-primary')}
              >
                Price: High to Low
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortBy('name_asc')}
                className={cn(sortBy === 'name_asc' && 'bg-primary/10 text-primary')}
              >
                Name: A to Z
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card 
              key={product.id} 
              className="holographic-card group overflow-hidden flex flex-col"
            >
              {/* Product Image Placeholder */}
              <div className="relative aspect-square bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
                <Package className="w-16 h-16 text-muted-foreground/30" />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {product.isFeatured && (
                    <Badge className="bg-primary text-primary-foreground">
                      Featured
                    </Badge>
                  )}
                  {product.comparePrice && (
                    <Badge variant="destructive">
                      Sale
                    </Badge>
                  )}
                </div>

                {/* Quick View Button */}
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-background/80"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <span className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium">
                        Quick View
                      </span>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="font-orbitron text-xl">
                        {product.name}
                      </DialogTitle>
                      <DialogDescription>
                        {product.shortDescription}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Image */}
                      <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center">
                        <Package className="w-24 h-24 text-muted-foreground/30" />
                      </div>
                      
                      {/* Details */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  'w-4 h-4',
                                  i < Math.floor(product.rating)
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-muted-foreground'
                                )}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            ({product.reviewCount} reviews)
                          </span>
                        </div>

                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-primary">
                            {formatCurrency(product.price)}
                          </span>
                          {product.comparePrice && (
                            <span className="text-lg text-muted-foreground line-through">
                              {formatCurrency(product.comparePrice)}
                            </span>
                          )}
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm">Description</h4>
                          <p className="text-sm text-muted-foreground">
                            {product.description}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm">Specifications</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {product.specifications.slice(0, 4).map((spec, i) => (
                              <li key={i} className="flex justify-between">
                                <span>{spec.label}:</span>
                                <span className="text-foreground">{spec.value}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex gap-2 pt-4">
                          <Button
                            className="flex-1 btn-holographic"
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stock === 0}
                          >
                            {addedToCart === product.id ? (
                              <>
                                <Check className="w-4 h-4 mr-2" />
                                Added!
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Add to Cart
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            className="border-primary/30"
                            asChild
                          >
                            <Link to={`/products/${product.id}`}>
                              Details
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-primary uppercase tracking-wider mb-1">
                      {product.category}
                    </p>
                    <h3 className="font-orbitron font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pb-2 flex-1">
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {product.shortDescription}
                </p>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'w-3 h-3',
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-muted-foreground'
                      )}
                    />
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">
                    ({product.reviewCount})
                  </span>
                </div>
              </CardContent>

              <CardFooter className="pt-0 flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-primary">
                    {formatCurrency(product.price)}
                  </span>
                  {product.comparePrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatCurrency(product.comparePrice)}
                    </span>
                  )}
                </div>
                <Button
                  size="sm"
                  className="btn-holographic"
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                >
                  {addedToCart === product.id ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <ShoppingCart className="w-4 h-4" />
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-orbitron text-xl font-semibold mb-2">
              No products found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
