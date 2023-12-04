export const TemplateInvoice = () => {
  const template = `
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
                                background-color: #fdba74;
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
                                                Logo
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
                                                color: #f97316;
                                                "
                                            >
                                                BILLED TO:
                                            </td>
                                            </tr>
                                            <tr>
                                            <td style="text-transform: capitalize">
                                                Jhon Doe
                                            </td>
                                            </tr>
                                            <tr>
                                            <td>+6289627006169</td>
                                            </tr>
                                            <tr>
                                            <td>gerhanaini@gmail.com</td>
                                            </tr>
                                            <tr>
                                            <td>Jln. Kuta Badung, Bali Indonesia</td>
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
                                            <td>Invoice No: ODR1</td>
                                            </tr>
                                            <tr>
                                            <td>Order Date: 2 Desember 2023</td>
                                            </tr>
                                            <tr>
                                            <td>Payment Method: TRANSFER</td>
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
                                        background-color: #fdba74;
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
                                <tbody>
                                    <tr style="border-bottom: #1f2937 solid 1px">
                                    <td style="text-align: left; padding: 8px">
                                        Absolut Vodka
                                    </td>
                                    <td style="text-align: center; padding: 8px">
                                        Rp 550.000
                                    </td>
                                    <td style="text-align: center; padding: 8px">
                                        1
                                    </td>
                                    <td style="text-align: center; padding: 8px">
                                        Rp. 550.000
                                    </td>
                                    </tr>
                                    <tr style="border-bottom: #1f2937 solid 1px">
                                    <td style="text-align: left; padding: 8px">
                                        Absolut Vodka
                                    </td>
                                    <td style="text-align: center; padding: 8px">
                                        Rp 550.000
                                    </td>
                                    <td style="text-align: center; padding: 8px">
                                        1
                                    </td>
                                    <td style="text-align: center; padding: 8px">
                                        Rp. 550.000
                                    </td>
                                    </tr>
                                    <tr style="border-bottom: #1f2937 solid 1px">
                                    <td style="text-align: left; padding: 8px">
                                        Absolut Vodka
                                    </td>
                                    <td style="text-align: center; padding: 8px">
                                        Rp 550.000
                                    </td>
                                    <td style="text-align: center; padding: 8px">
                                        1
                                    </td>
                                    <td style="text-align: center; padding: 8px">
                                        Rp. 550.000
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
                                                color: #f97316;
                                                "
                                            >
                                                Note:
                                            </td>
                                            </tr>
                                            <tr>
                                            <td style="line-height: 18px">
                                                Lorem ipsum dolor sit, amet consectetur
                                                adipisicing elit. Vitae quasi fugit
                                                deserunt deleniti voluptatum laboriosam
                                                repellat ducimus provident consequatur
                                                error sapiente similique, aut dolores
                                                est illum porro obcaecati minima et!
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
                                                Rp 3.450.000
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
                                                Rp 379.500
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
                                                Rp 30.000
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
                                                Rp 4.000
                                            </td>
                                            </tr>
                                            <tr
                                            style="
                                                font-weight: 600;
                                                background-color: #fdba74;
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
                                                Rp 3.855.500
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
                                                color: #f97316;
                                                padding-bottom: 6px;
                                                "
                                            >
                                                payment information
                                            </td>
                                            </tr>
                                            <tr>
                                            <td>mandiri bank</td>
                                            </tr>
                                            <tr>
                                            <td>account name: Andria Pratama</td>
                                            </tr>
                                            <tr>
                                            <td>account number: 283732847329838</td>
                                            </tr>
                                            <tr>
                                            <td>pay by 4 december 2023</td>
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
                        style="width: 100%; height: 40px; background-color: #fdba74"
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
