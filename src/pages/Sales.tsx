"use client"

import { useState } from "react"
import { MainLayout } from "../components/layout/MainLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useLocalStorage } from "../hooks/useLocalStorage"

interface Sale {
  id: string
  product: string
  quantity: number
  price: number
  total: number
  date: string
}

export default function Sales() {
  const [products] = useLocalStorage<{ id: string; name: string; price: number }[]>("products", [
    { id: "1", name: "T-Shirt", price: 19.99 },
    { id: "2", name: "Jeans", price: 39.99 },
    { id: "3", name: "Dress", price: 49.99 },
    { id: "4", name: "Jacket", price: 59.99 },
  ])

  const [sales, setSales] = useLocalStorage<Sale[]>("sales", [
    { id: "1", product: "T-Shirt", quantity: 2, price: 19.99, total: 39.98, date: "2023-06-01" },
    { id: "2", product: "Jeans", quantity: 1, price: 39.99, total: 39.99, date: "2023-06-02" },
    { id: "3", product: "Dress", quantity: 3, price: 49.99, total: 149.97, date: "2023-06-03" },
  ])

  const [newSale, setNewSale] = useState<Omit<Sale, "id" | "total">>({
    product: "",
    quantity: 1,
    price: 0,
    date: new Date().toISOString().split("T")[0],
  })

  const handleProductChange = (productName: string) => {
    const product = products.find((p) => p.name === productName)
    setNewSale({
      ...newSale,
      product: productName,
      price: product ? product.price : 0,
    })
  }

  const handleAddSale = () => {
    const id = Date.now().toString()
    const total = newSale.quantity * newSale.price
    setSales([...sales, { id, ...newSale, total }])
    setNewSale({
      product: "",
      quantity: 1,
      price: 0,
      date: new Date().toISOString().split("T")[0],
    })
  }

  const handleDeleteSale = (id: string) => {
    setSales(sales.filter((sale) => sale.id !== id))
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Sales</h1>
          <Button>Export to Excel</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add New Sale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="product">Product</Label>
                <Select value={newSale.product} onValueChange={handleProductChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.name}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={newSale.quantity}
                  onChange={(e) => setNewSale({ ...newSale, quantity: Number.parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={newSale.price}
                  onChange={(e) => setNewSale({ ...newSale, price: Number.parseFloat(e.target.value) })}
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={newSale.date}
                  onChange={(e) => setNewSale({ ...newSale, date: e.target.value })}
                />
              </div>
            </div>
            <Button className="mt-4" onClick={handleAddSale}>
              Add Sale
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>{sale.product}</TableCell>
                    <TableCell>{sale.quantity}</TableCell>
                    <TableCell>${sale.price.toFixed(2)}</TableCell>
                    <TableCell>${sale.total.toFixed(2)}</TableCell>
                    <TableCell>{sale.date}</TableCell>
                    <TableCell>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteSale(sale.id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
