import { OrderType } from "@/types/admin/OrderType";
import { ConvertIDR } from "./ConvertIDR";
import { SettingType } from "@/types/admin/SettingType";

export const TemplateInvoiceImage = (
  order: OrderType,
  setting: SettingType
) => {
  const color: string = "#cfaa71";
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const date = new Date(order.createdAt);
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  const tableBody = () => {
    let tableBody: string = "";
    order.orderDetail.map(
      (item) =>
        (tableBody =
          tableBody +
          `<tr style="border-bottom: #1f2937 solid 1px">` +
          `<td style="text-align: left; padding: 8px">` +
          `${item.name}` +
          `</td>` +
          `<td style="text-align: center; padding: 8px">` +
          `${ConvertIDR(item.price)}` +
          `</td>` +
          `<td style="text-align: center; padding: 8px">` +
          `${item.quantity}` +
          `</td>` +
          `<td style="text-align: center; padding: 8px">` +
          `${ConvertIDR(item.total)}` +
          `</td>` +
          `</tr>`)
    );

    return tableBody;
  };

  const template =
    `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Invoice</title>
  </head>
  <body
    style="
        width: 595px;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
        Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
        sans-serif;
    "
  >
    <div id="content">
      <div
        style="
          width: 595px;
          min-height: fit-content;
          background-color: ${color};
          overflow: hidden;
          position: relative;
        "
      >
        <div
          style="
            width: 515px;
            min-height: fit-content;
            padding-left: 40px;
            padding-right: 40px;
            padding-top: 64px;
            background-color: #ffffff;
            border-top-left-radius: 300px;
            position: relative;
          "
        >
          <div style="width: 100%; display: flex; justify-content: center">
            <img
            src="${setting.image}"
              alt="logo"
              style="width: 100px; height: 100px; object-fit: contain"
            />
          </div>

          <div
            style="
              width: 515px;
              display: grid;
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: 12px;
              margin-top: 48px;
              font-size: 12px;
              line-height: 15px;
            "
          >
            <div style="width: 100%; margin-top: 8px">
              <div
                style="
                  font-weight: 600;
                  text-transform: uppercase;
                  color: ${color};
                "
              >
                Billed to:
              </div>
              <div style="text-transform: capitalize">${order.user.firstName} ${order.user.lastName}</div>
              <div>${order.user.phone}</div>
              <div>${order.user.email}</div>
              <div>${order.user.address}</div>
            </div>

            <div style="width: 100%; text-align: right">
              <div
                style="
                  font-size: 24px;
                  line-height: 32px;
                  text-transform: uppercase;
                "
              >
                Invoice
              </div>
              <div>Invoice No: ${order.invoice}</div>
              <div>Order Date: ${day} ${month} ${year}</div>
              <div>
                Payment Method:
                <span style="text-transform: uppercase">${order.paymentMethod}</span>
              </div>
            </div>
          </div>

          <div style="width: 100%; margin-top: 28px">
            <table
              style="
                width: 100%;
                background-color: #ffffff;
                margin-bottom: 20px;
                font-size: 12px;
                line-height: 16px;
                border-collapse: collapse;
              "
            >
              <thead>
                <tr
                  style="
                    border-bottom: #1f2937 solid 1px;
                    font-weight: 500;
                    background-color: ${color};
                    color: black;
                  "
                >
                  <th style="text-align: left; padding: 8px">Name</th>
                  <th style="text-align: center; padding: 8px">Price</th>
                  <th style="text-align: center; padding: 8px">Quantity</th>
                  <th style="text-align: center; padding: 8px">Sub Total</th>
                </tr>
              </thead>
              <tbody>` +
    tableBody() +
    `</tbody>
            </table>
          </div>

          <div
            style="
              width: 100%;
              display: grid;
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: 12px;
              font-size: 12px;
              line-height: 15px;
            "
          >
            <div style="width: 100%">
              <div
                style="
                  font-weight: 600;
                  text-transform: uppercase;
                  margin-bottom: 6px;
                  color: ${color};
                "
              >
                Note:
              </div>
              <div style="line-height: 18px">
              ${order.note}
              </div>
            </div>

            <div style="width: 100%">
              <div
                style="
                  width: 100%;
                  display: flex;
                  justify-content: end;
                  margin-bottom: 8px;
                "
              >
                <div
                  style="
                    width: 210px;
                    padding-left: 8px;
                    padding-right: 8px;
                    display: flex;
                    justify-content: space-between;
                    font-weight: 600;
                  "
                >
                  Total
                  <div style="font-weight: 400">${ConvertIDR(
                    order.subTotal ? order.subTotal : 0
                  )}</div>
                </div>
              </div>
              <div
                style="
                  width: 100%;
                  display: flex;
                  justify-content: end;
                  margin-bottom: 8px;
                "
              >
                <div
                  style="
                    width: 210px;
                    padding-left: 8px;
                    padding-right: 8px;
                    display: flex;
                    justify-content: space-between;
                    font-weight: 600;
                  "
                >
                  Tax
                  <div style="font-weight: 400">${ConvertIDR(
                    order.tax ? order.tax : 0
                  )}</div>
                </div>
              </div>
              <div
                style="
                  width: 100%;
                  display: flex;
                  justify-content: end;
                  margin-bottom: 8px;
                "
              >
                <div
                  style="
                    width: 210px;
                    padding-left: 8px;
                    padding-right: 8px;
                    display: flex;
                    justify-content: space-between;
                    font-weight: 600;
                  "
                >
                  Shipping
                  <div style="font-weight: 400">${ConvertIDR(
                    order.shipping ? order.shipping : 0
                  )}</div>
                </div>
              </div>
              <div
                style="
                  width: 100%;
                  display: flex;
                  justify-content: end;
                  margin-bottom: 8px;
                "
              >
                <div
                  style="
                    width: 210px;
                    padding-left: 8px;
                    padding-right: 8px;
                    display: flex;
                    justify-content: space-between;
                    font-weight: 600;
                  "
                >
                  Discount
                  <div style="font-weight: 400">${ConvertIDR(
                    order.discount ? order.discount : 0
                  )}</div>
                </div>
              </div>
              <div
                style="
                  width: 100%;
                  display: flex;
                  justify-content: end;
                  margin-bottom: 8px;
                "
              >
                <div
                  style="
                    width: 210px;
                    padding-left: 8px;
                    padding-right: 8px;
                    padding-top: 8px;
                    padding-bottom: 4px;
                    display: flex;
                    justify-content: space-between;
                    font-weight: 600;
                    background-color: ${color};
                    color: black;
                    font-size: 14px;
                    line-height: 20px;
                  "
                >
                  Grand Total
                  <div>${ConvertIDR(
                    order.grandTotal ? order.grandTotal : 0
                  )}</div>
                </div>
              </div>
            </div>
          </div>

          <div
            style="
              width: 100%;
              display: grid;
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: 12px;
              font-size: 12px;
              line-height: 15px;
              margin-top: 28px;
              text-transform: capitalize;
              padding-bottom: 70px;
            "
          >
            <div style="width: 100%">
              <div
                style="
                  text-transform: uppercase;
                  font-weight: 600;
                  color: ${color};
                  margin-bottom: 6px;
                "
              >
                payment information
              </div>
              <div style="text-transform: capitalize;">${setting.bank}</div>
              <div style="text-transform: capitalize;">account name: ${
                setting.bankName
              }</div>
              <div>account number: ${setting.bankNumber}</div>
            </div>

            <div
              style="
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <div style="font-size: 14px; line-height: 20px">Thank you!</div>
            </div>
          </div>
        </div>
        <div
          style="
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 40px;
            background-color: ${color};
            z-index: 50;
          "
        ></div>
      </div>
    </div>
  </body>
</html>
  `;

  return template;
};
