"use client";

import CartTotal from "./CartTotal";
import { CartType } from "@/types/CartType";
import CartTablePromo from "./CartTablePromo";
import CartTableProduct from "./CartTableProduct";
import React from "react";
import { ToastContainer } from "react-toastify";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CartMobileTableProduct from "./CartMobileTableProduct";
import CartMobileTablePromo from "./CartMobileTablePromo";
import { useCartHook } from "@/hooks/client/CartClientSideHook";

interface CartTableProps {
  carts?: CartType[];
}

const CartTable: React.FC<CartTableProps> = ({ carts }) => {
  const { cartList, setCartList, handleDelete, handleChecked } =
    useCartHook(carts);

  return (
    <div className="w-full lg:min-h-[calc(100vh-536px)] md:min-h-[calc(100vh-487px)]">
      <ToastContainer />

      <div className="w-full lg:flex justify-center lg:mt-[150px] md:mt-[100px] font-serif hidden">
        <div className="w-[80%]">
          <Table className="bg-white rounded-md">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">#</TableHead>
                <TableHead className="text-center">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-center">Quantity</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cartList.length > 0 ? (
                cartList.map((cart: CartType, index) => {
                  if (cart.product) {
                    return (
                      <CartTableProduct
                        cart={cart}
                        index={index}
                        cartList={cartList}
                        setCartList={setCartList}
                        handleChecked={handleChecked}
                        handleDelete={handleDelete}
                        key={cart.product.slug}
                      />
                    );
                  }

                  if (cart.promo) {
                    return (
                      <CartTablePromo
                        cart={cart}
                        index={index}
                        cartList={cartList}
                        setCartList={setCartList}
                        handleChecked={handleChecked}
                        handleDelete={handleDelete}
                        key={cart.promo.slug}
                      />
                    );
                  }
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Empty data
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="w-full block lg:hidden mt-[80px] font-serif">
        <Table className="bg-white" overflow="hidden">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-[2%]">#</TableHead>
              <TableHead colSpan={3} className="text-center">
                Products
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cartList.length > 0 ? (
              cartList.map((cart: CartType, index) => {
                if (cart.product) {
                  return (
                    <CartMobileTableProduct
                      cart={cart}
                      index={index}
                      cartList={cartList}
                      setCartList={setCartList}
                      handleChecked={handleChecked}
                      handleDelete={handleDelete}
                      key={cart.product.slug}
                    />
                  );
                }

                if (cart.promo) {
                  return (
                    <CartMobileTablePromo
                      cart={cart}
                      index={index}
                      cartList={cartList}
                      setCartList={setCartList}
                      handleChecked={handleChecked}
                      handleDelete={handleDelete}
                      key={cart.promo.slug}
                    />
                  );
                }
              })
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  Empty data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <CartTotal carts={cartList} />
    </div>
  );
};

export default CartTable;
