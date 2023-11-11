export const TemplateEmailVerify = (name: string, link: string) => {
  const template = `<!DOCTYPE html>
    <html>
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Please activate your account</title>
      </head>
    
      <body
        style="
          font-family: Helvetica, Arial, sans-serif;
          margin: 0px;
          padding: 0px;
          background-color: #ffffff;
        "
      >
        <table
          role="presentation"
          style="
            width: 100%;
            border-collapse: collapse;
            border: 0px;
            border-spacing: 0px;
            font-family: Arial, Helvetica, sans-serif;
            background-color: rgb(239, 239, 239);
          "
        >
          <tbody>
            <tr>
              <td
                align="center"
                style="padding: 1rem 2rem; vertical-align: top; width: 100%"
              >
                <table
                  role="presentation"
                  style="
                    max-width: 600px;
                    border-collapse: collapse;
                    border: 0px;
                    border-spacing: 0px;
                    text-align: left;
                  "
                >
                  <tbody>
                    <tr>
                      <td style="padding: 40px 0px 0px">
                        <div
                          style="
                            padding: 20px;
                            background-color: rgb(255, 255, 255);
                          "
                        >
                          <div style="color: rgb(0, 0, 0); text-align: left">
                            <h1 style="margin: 1rem 0">Email Verify</h1>
                            <p>Hai ${name}</p>
                            <p style="padding-bottom: 16px">
                              Follow this link to verify your email address.
                            </p>
                            <p style="padding-bottom: 16px">
                              <a
                                href="${link}"
                                target="_blank"
                                style="
                                  padding: 12px 24px;
                                  border-radius: 4px;
                                  color: #fff;
                                  background: #2b52f5;
                                  display: inline-block;
                                  margin: 0.5rem 0;
                                "
                                >Confirm now</a
                              >
                            </p>
                            <p style="padding-bottom: 16px">
                              If you didn’t ask to verify this address, you can
                              ignore this email.
                            </p>
                            <p style="padding-bottom: 16px">
                              Thanks,<br />Drinks Store
                            </p>
                          </div>
                        </div>
                      </td>
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
