import axios from "axios";
import { useParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSWRConfig } from "swr";

interface ErrorType {
  error: boolean;
  message: string;
}

interface ValueType {
  shipping: number;
  discount: number;
  grandTotal: number;
}

export const useODEditTransactionHook = (
  setIsOpen: Dispatch<SetStateAction<boolean>>,
  shipping: number | null,
  discount: number | null,
  subTotal: number,
  tax: number
) => {
  const params: { id: string } = useParams();

  const invoice: string = params.id;

  const shippingValue = shipping ? shipping : 0;
  const discountValue = discount ? discount : 0;
  const total = subTotal + tax;

  const [value, setValue] = useState<ValueType>({
    shipping: 0,
    discount: 0,
    grandTotal: 0,
  });

  const [isOpenWarningAlert, setIsOpenWarningAlert] = useState<boolean>(false);

  const [isLoadingStore, setIsLoadingStore] = useState<boolean>(false);

  const { mutate } = useSWRConfig();

  useEffect(() => {
    setValue({
      shipping: shippingValue,
      discount: discountValue,
      grandTotal: total + shippingValue - discountValue,
    });
  }, [shippingValue, discountValue, total]);

  const [errorShipping, setErrorShipping] = useState<ErrorType>({
    error: false,
    message: "",
  });
  const [errorDiscount, setErrorDiscount] = useState<ErrorType>({
    error: false,
    message: "",
  });

  const regex = /[a-zA-Z!@#$&()\\-`.+,/\"]/g;

  const handleShipping = (val: string) => {
    if (val.match(regex)) {
      return null;
    } else {
      if (!val || val === undefined || val === null) {
        setValue((prev) => ({
          shipping: 0,
          discount: prev.discount,
          grandTotal: total + 0 - prev.discount,
        }));

        setErrorShipping({
          error: false,
          message: "",
        });
      } else if (value.shipping >= 10000000) {
        setValue((prev) => ({
          shipping: 10000000,
          discount: prev.discount,
          grandTotal: total + 10000000 - prev.discount,
        }));
      } else {
        setValue((prev) => ({
          shipping: parseInt(val),
          discount: prev.discount,
          grandTotal: total + parseInt(val) - prev.discount,
        }));

        if (parseInt(val) > 0 && parseInt(val) < 1000) {
          setErrorShipping({
            error: true,
            message: "Biaya pengiriman minimal Rp. 1.000",
          });
        } else {
          setErrorShipping({
            error: false,
            message: "",
          });
        }
      }
    }
  };

  const handleDiscount = (val: string) => {
    if (val.match(regex)) {
      return null;
    } else {
      if (!val || val === undefined || val === null) {
        setValue((prev) => ({
          shipping: prev.shipping,
          discount: 0,
          grandTotal: total + prev.shipping - 0,
        }));

        setErrorDiscount({
          error: false,
          message: "",
        });
      } else if (parseInt(val) > total + value.shipping) {
        setValue((prev) => ({
          shipping: prev.shipping,
          discount: total + prev.shipping,
          grandTotal: total + prev.shipping - (total + prev.shipping),
        }));
      } else {
        setValue((prev) => ({
          shipping: prev.shipping,
          discount: parseInt(val),
          grandTotal: total + prev.shipping - parseInt(val),
        }));

        if (parseInt(val) > 0 && parseInt(val) < 1000) {
          setErrorDiscount({
            error: true,
            message: "Diskon minimal Rp. 1.000",
          });
        } else {
          setErrorDiscount({
            error: false,
            message: "",
          });
        }
      }
    }
  };

  const handleSubmit = () => {
    if (!errorShipping.error && !errorDiscount.error) {
      setIsOpenWarningAlert(true);
    }
  };

  const handleStoreData = async () => {
    try {
      setIsLoadingStore(true);

      await axios.patch(`/api/admin/orders/${invoice}/other-cost/patch`, {
        shipping: value.shipping,
        discount: value.discount,
      });

      mutate(`/api/admin/orders/${invoice}/order-detail/get`);

      setIsOpenWarningAlert(false);
      setIsLoadingStore(false);
      setIsOpen(false);

      toast.success("Biaya transaksi telah diubah.");

      setValue({
        shipping: shippingValue,
        discount: discountValue,
        grandTotal: total + shippingValue - discountValue,
      });
    } catch (error: any) {
      toast.error(error.response.data.message);
      setIsLoadingStore(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setValue({
      shipping: shippingValue,
      discount: discountValue,
      grandTotal: total + shippingValue - discountValue,
    });

    setErrorShipping({
      error: false,
      message: "",
    });

    setErrorDiscount({
      error: false,
      message: "",
    });
  };

  return {
    value,
    setValue,
    errorShipping,
    setErrorShipping,
    errorDiscount,
    setErrorDiscount,
    handleShipping,
    handleDiscount,
    handleSubmit,
    handleCancel,
    isOpenWarningAlert,
    setIsOpenWarningAlert,
    isLoadingStore,
    setIsLoadingStore,
    handleStoreData,
  };
};
