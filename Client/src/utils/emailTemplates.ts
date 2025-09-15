export function getOTPTemplate(otp: string, email: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to StockSage</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table align="center" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 20px auto;">
          <tr>
            <td bgcolor="#ffffff" style="padding: 40px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <h1 style="color: #1a1a1a; font-size: 28px; margin: 0 0 20px;">Welcome to StockSage</h1>
                  </td>
                </tr>
                <tr>
                  <td style="color: #666; font-size: 16px; line-height: 24px;">
                    <p style="margin: 0 0 20px;">Hello ${email},</p>
                    <p style="margin: 0 0 20px;">Thank you for joining StockSage! To complete your registration, please use the following One-Time Password (OTP):</p>
                    <div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 4px; margin: 20px 0;">
                      <span style="font-size: 24px; font-weight: bold; color: #007bff; letter-spacing: 4px;">${otp}</span>
                    </div>
                    <p style="margin: 0 0 20px;">This OTP is valid for 10 minutes. Please enter it on the verification page to activate your account.</p>
                    <p style="margin: 0;">Happy Trading!<br>The StockSage Team</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 20px 0; color: #999; font-size: 12px;">
              <p style="margin: 0;">© ${new Date().getFullYear()} StockSage. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
  }