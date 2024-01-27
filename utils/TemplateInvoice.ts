import { OrderType } from "@/types/admin/OrderType";
import { ConvertIDR } from "./ConvertIDR";
import { SettingType } from "@/types/admin/SettingType";

export const TemplateInvoice = (order: OrderType, setting: SettingType) => {
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
            margin: 0px;
            padding: 0px;
            color: #1f2937;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
                Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
                sans-serif;
            background-color: rgb(239, 239, 239);
            "
        >
            <table
            role="presentation"
            style="
                width: 100%;
                border-collapse: collapse;
                border: 0px;
                border-spacing: 0px;
            "
            >
            <tbody>
                <tr>
                <td align="center">
                    <table
                    role="presentation"
                    style="
                        width: 595px;
                        border-collapse: collapse;
                        border: 0px;
                        border-spacing: 0px;
                        text-align: left;
                    "
                    >
                    <tbody>
                        <tr>
                        <td>
                            <div
                            style="
                                width: 595px;
                                height: fit-content;
                                background-color: ${color};
                                overflow: hidden;
                                position: relative;
                            "
                            >
                            <div
                                style="
                                width: 515px;
                                height: fit-content;
                                padding-left: 40px;
                                padding-right: 40px;
                                padding-top: 64px;
                                padding-bottom: 40px;
                                background-color: #ffffff;
                                border-top-left-radius: 300px;
                                position: relative;
                                "
                            >
                                <table
                                role="presentation"
                                style="
                                    width: 100%;
                                    border-collapse: collapse;
                                    border: 0px;
                                    border-spacing: 0px;
                                "
                                >
                                <tbody>
                                    <tr>
                                    <td align="center">
                                        <table
                                        role="presentation"
                                        style="width: fit-content"
                                        >
                                        <tbody>
                                            <tr>
                                            <td
                                                style="
                                                font-size: 30px;
                                                line-height: 36px;
                                                "
                                            >
                                            <img
                                                src="${setting.image}"
                                                alt="logo"
                                                style="width: 100px; height: 100px; object-fit: contain"
                                            />
                                            </td>
                                            </tr>
                                        </tbody>
                                        </table>
                                    </td>
                                    </tr>
                                </tbody>
                                </table>

                                <table
                                role="presentation"
                                style="
                                    width: 100%;
                                    border-collapse: collapse;
                                    border: 0px;
                                    border-spacing: 0px;
                                    margin-top: 48px;
                                    font-size: 12px;
                                    line-height: 15px;
                                "
                                >
                                <tbody>
                                    <tr>
                                    <td style="widht: 50%">
                                        <table
                                        role="presentation"
                                        style="
                                            width: 100%;
                                            border-collapse: collapse;
                                            border: 0px;
                                            border-spacing: 0px;
                                        "
                                        >
                                        <tbody>
                                            <tr>
                                            <td
                                                style="
                                                font-weight: 600;
                                                text-transform: uppercase;
                                                color: ${color};
                                                "
                                            >
                                                BILLED TO:
                                            </td>
                                            </tr>
                                            <tr>
                                            <td style="text-transform: capitalize">
                                                ${order.user.firstName} ${order.user.lastName}
                                            </td>
                                            </tr>
                                            <tr>
                                            <td>${order.user.phone}</td>
                                            </tr>
                                            <tr>
                                            <td>${order.user.email}</td>
                                            </tr>
                                            <tr>
                                            <td>${order.user.address}</td>
                                            </tr>
                                        </tbody>
                                        </table>
                                    </td>

                                    <td style="widht: 50%">
                                        <table
                                        role="presentation"
                                        style="
                                            width: 100%;
                                            border-collapse: collapse;
                                            border: 0px;
                                            border-spacing: 0px;
                                            text-align: right;
                                        "
                                        >
                                        <tbody>
                                            <tr>
                                            <td
                                                style="
                                                font-size: 24px;
                                                line-height: 32px;
                                                text-transform: uppercase;
                                                "
                                            >
                                                invoice
                                            </td>
                                            </tr>
                                            <tr>
                                            <td>Invoice No: ${order.invoice}</td>
                                            </tr>
                                            <tr>
                                            <td>Order Date: ${day} ${month} ${year}</td>
                                            </tr>
                                            <tr>
                                            <td>
                                                Payment Method: 
                                                <span style="text-transform: uppercase">
                                                    ${order.paymentMethod}
                                                </span>
                                            </td>
                                            </tr>
                                        </tbody>
                                        </table>
                                    </td>
                                    </tr>
                                </tbody>
                                </table>

                                <table
                                style="
                                    width: 100%;
                                    background-color: #ffffff;
                                    margin-bottom: 20px;
                                    font-size: 12px;
                                    line-height: 16px;
                                    border-collapse: collapse;
                                    margin-top: 28px;
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
                                    <th style="text-align: left; padding: 8px">
                                        Name
                                    </th>
                                    <th style="text-align: center; padding: 8px">
                                        Price
                                    </th>
                                    <th style="text-align: center; padding: 8px">
                                        Quantity
                                    </th>
                                    <th style="text-align: center; padding: 8px">
                                        Sub Total
                                    </th>
                                    </tr>
                                </thead>
                                <tbody>` +
    tableBody() +
    `</tbody>
                                </table>

                                <table
                                role="presentation"
                                style="
                                    width: 100%;
                                    border-collapse: collapse;
                                    border: 0px;
                                    border-spacing: 0px;
                                    font-size: 12px;
                                    line-height: 15px;
                                "
                                >
                                <tbody>
                                    <tr>
                                    <td style="width: 50%; vertical-align: top">
                                        <table
                                        role="presentation"
                                        style="
                                            width: 100%;
                                            border-collapse: collapse;
                                            border: 0px;
                                            border-spacing: 0px;
                                        "
                                        >
                                        <tbody>
                                            <tr>
                                            <td
                                                style="
                                                font-weight: 600;
                                                text-transform: uppercase;
                                                padding-bottom: 6px;
                                                color: ${color};
                                                "
                                            >
                                                Note:
                                            </td>
                                            </tr>
                                            <tr>
                                            <td style="line-height: 18px">
                                                ${order.note}
                                            </td>
                                            </tr>
                                        </tbody>
                                        </table>
                                    </td>
                                    <td style="width: 5%"></td>
                                    <td style="width: 45%; vertical-align: top">
                                        <table
                                        role="presentation"
                                        style="
                                            width: 100%;
                                            border-collapse: collapse;
                                            border: 0px;
                                            border-spacing: 0px;
                                            font-size: 13px;
                                        "
                                        >
                                        <tbody align="right">
                                            <tr>
                                            <td
                                                style="
                                                padding-bottom: 8px;
                                                font-weight: 600;
                                                text-align: left;
                                                padding-left: 8px;
                                                "
                                            >
                                                Total
                                            </td>
                                            <td
                                                style="
                                                padding-bottom: 8px;
                                                padding-right: 8px;
                                                "
                                            >
                                                ${ConvertIDR(
                                                  order.subTotal
                                                    ? order.subTotal
                                                    : 0
                                                )}
                                            </td>
                                            </tr>
                                            <tr>
                                            <td
                                                style="
                                                padding-bottom: 8px;
                                                font-weight: 600;
                                                text-align: left;
                                                padding-left: 8px;
                                                "
                                            >
                                                Tax
                                            </td>
                                            <td
                                                style="
                                                padding-bottom: 8px;
                                                padding-right: 8px;
                                                "
                                            >
                                               ${ConvertIDR(
                                                 order.tax ? order.tax : 0
                                               )}
                                            </td>
                                            </tr>
                                            <tr>
                                            <td
                                                style="
                                                padding-bottom: 8px;
                                                font-weight: 600;
                                                text-align: left;
                                                padding-left: 8px;
                                                "
                                            >
                                                Shipping
                                            </td>
                                            <td
                                                style="
                                                padding-bottom: 8px;
                                                padding-right: 8px;
                                                "
                                            >
                                               ${ConvertIDR(
                                                 order.shipping
                                                   ? order.shipping
                                                   : 0
                                               )}
                                            </td>
                                            </tr>
                                            <tr>
                                            <td
                                                style="
                                                padding-bottom: 8px;
                                                font-weight: 600;
                                                text-align: left;
                                                padding-left: 8px;
                                                "
                                            >
                                                Discount
                                            </td>
                                            <td
                                                style="
                                                padding-bottom: 8px;
                                                padding-right: 8px;
                                                "
                                            >
                                                ${ConvertIDR(
                                                  order.discount
                                                    ? order.discount
                                                    : 0
                                                )}
                                            </td>
                                            </tr>
                                            <tr
                                            style="
                                                font-weight: 600;
                                                background-color: ${color};
                                                color: black;
                                                font-size: 14px;
                                                line-height: 20px;
                                            "
                                            >
                                            <td
                                                style="
                                                padding-left: 8px;
                                                padding-top: 4px;
                                                padding-bottom: 8px;
                                                text-align: left;
                                                "
                                            >
                                                Grand Total
                                            </td>
                                            <td
                                                style="
                                                padding-right: 8px;
                                                padding-top: 4px;
                                                padding-bottom: 8px;
                                                "
                                            >
                                                ${ConvertIDR(
                                                  order.grandTotal
                                                    ? order.grandTotal
                                                    : 0
                                                )}
                                            </td>
                                            </tr>
                                        </tbody>
                                        </table>
                                    </td>
                                    </tr>
                                </tbody>
                                </table>

                                <table
                                role="presentation"
                                style="
                                    width: 100%;
                                    border-collapse: collapse;
                                    border: 0px;
                                    border-spacing: 0px;
                                    margin-top: 28px;
                                    font-size: 12px;
                                    line-height: 15px;
                                    text-transform: capitalize;
                                "
                                >
                                <tbody>
                                    <tr>
                                    <td style="width: 50%">
                                        <table
                                        role="presentation"
                                        style="
                                            width: 100%;
                                            border-collapse: collapse;
                                            border: 0px;
                                            border-spacing: 0px;
                                        "
                                        >
                                        <tbody>
                                            <tr>
                                            <td
                                                style="
                                                text-transform: uppercase;
                                                font-weight: 600;
                                                color: ${color};
                                                padding-bottom: 6px;
                                                "
                                            >
                                                payment information
                                            </td>
                                            </tr>
                                            <tr>
                                            <td>${setting.bank}</td>
                                            </tr>
                                            <tr>
                                            <td>account name: ${
                                              setting.bankName
                                            }</td>
                                            </tr>
                                            <tr>
                                            <td>account number: ${
                                              setting.bankNumber
                                            }</td>
                                            </tr>
                                        </tbody>
                                        </table>
                                    </td>
                                    <td style="width: 5%"></td>
                                    <td
                                        style="
                                        width: 45%;
                                        height: 100%;
                                        text-align: center;
                                        vertical-align: middle;
                                        font-size: 14px;
                                        line-height: 20px;
                                        "
                                    >
                                        Thank you!
                                    </td>
                                    </tr>
                                </tbody>
                                </table>
                            </div>
                            </div>
                        </td>
                        </tr>
                    </tbody>
                    </table>
                    <table
                    role="presentation"
                    style="
                        width: 595px;
                        border-collapse: collapse;
                        border: 0px;
                        border-spacing: 0px;
                    "
                    >
                    <tbody>
                        <tr
                        style="width: 100%; height: 40px; background-color: ${color}"
                        >
                        <td></td>
                        </tr>
                    </tbody>
                    </table>
                </td>
                </tr>
            </tbody>
            </table>
        </body>
    </html>
  `;

  return template;
};
