import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProductTable from './ProductTable'

describe('ProductTable', () => {
  const products = [
    {
      id: 1,
      name: 'Producto Test',
      sku: 'TEST001',
      categoryId: 10,
      price: 12.5,
      quantity: 8,
      minStock: 5,
      maxStock: 20
    }
  ]

  const categories = [
    { id: 10, name: 'Categoría Test' }
  ]

  it('muestra los datos del producto y el botón de comprar', async () => {
    const handlePurchase = vi.fn()
    render(
      <ProductTable
        products={products}
        categories={categories}
        canManage={false}
        canPurchase={true}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onPurchase={handlePurchase}
      />
    )

    expect(screen.getByText('Producto Test')).toBeInTheDocument()
    expect(screen.getByText('TEST001')).toBeInTheDocument()
    expect(screen.getByText('Categoría Test')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /comprar/i })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /comprar/i }))
    expect(handlePurchase).toHaveBeenCalledWith(products[0])
  })
})
