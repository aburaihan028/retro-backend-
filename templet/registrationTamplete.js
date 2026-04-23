export const registrationTemplate = (USER_NAME, OTP_CODE, EXPIRY_TIME) => {
  return `
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Verify Your Email</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f6f8;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.05);
    }
    .logo {
      text-align: center;
      margin-bottom: 20px;
    }
    .logo img {
      max-height: 60px;
    }
    h2 {
      color: #2d3748;
    }
    .otp-box {
      background-color: #edf2f7;
      padding: 20px;
      text-align: center;
      font-size: 28px;
      font-weight: bold;
      color: #2b6cb0;
      border-radius: 8px;
    width:300px;
      margin: 0px auto 20px auto;
    }
    .verify-button {
      display: block;
      width: fit-content;
      margin: 0 auto 30px auto;
      padding: 12px 24px;
      background-color: #2b6cb0;
      color: #ffffff;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
    }
    .verify-button:hover {
      background-color: #2c5282;
    }
    .expiration {
      color: #718096;
      margin-bottom: 30px;
    }
    .support {
      font-size: 14px;
      margin-top: 20px;
    }
    .footer {
      font-size: 12px;
      color: #a0aec0;
      text-align: center;
      margin-top: 40px;
    }
    a {
      color: #2b6cb0;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <img src="{{LOGO_URL}}" alt="{{COMPANY_NAME}} Logo">
    </div>
    <h2>Hi {{USER_NAME}},</h2>
    <p>Thanks for signing up with <strong>{{COMPANY_NAME}}</strong>!</p>
    <p>To verify your email address, please use the OTP code below:</p>

    <div class="otp-box">{{OTP_CODE}}</div>


    <div class="expiration">
      This code will expire in <strong>{{EXPIRY_TIME}} minutes</strong>.
    </div>

    <p>Didn’t request this? You can ignore this email.</p>

    <div class="support">
      Need help? Reach out to us at <a href="mailto:{{SUPPORT_EMAIL}}">{{SUPPORT_EMAIL}}</a>.
    </div>

    <div class="footer">
      &copy; {{CURRENT_YEAR}} {{COMPANY_NAME}} · <a href="{{COMPANY_WEBSITE}}">{{COMPANY_WEBSITE}}</a>
    </div>
  </div>
</body>
</html>
`

    .replace("{{USER_NAME}}", USER_NAME)
    .replace("{{OTP_CODE}}", OTP_CODE)
    .replace("{{EXPIRY_TIME}}", EXPIRY_TIME);
};

export const resendTemplate = (USER_NAME, OTP_CODE, EXPIRY_TIME) => {
  return `
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Verify Your Email</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f6f8;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.05);
    }
    .logo {
      text-align: center;
      margin-bottom: 20px;
    }
    .logo img {
      max-height: 60px;
    }
    h2 {
      color: #2d3748;
    }
    .otp-box {
      background-color: #edf2f7;
      padding: 20px;
      text-align: center;
      font-size: 28px;
      font-weight: bold;
      color: #2b6cb0;
      border-radius: 8px;
    width:300px;
      margin: 0px auto 20px auto;
    }
    .verify-button {
      display: block;
      width: fit-content;
      margin: 0 auto 30px auto;
      padding: 12px 24px;
      background-color: #2b6cb0;
      color: #ffffff;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
    }
    .verify-button:hover {
      background-color: #2c5282;
    }
    .expiration {
      color: #718096;
      margin-bottom: 30px;
    }
    .support {
      font-size: 14px;
      margin-top: 20px;
    }
    .footer {
      font-size: 12px;
      color: #a0aec0;
      text-align: center;
      margin-top: 40px;
    }
    a {
      color: #2b6cb0;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <img src="{{LOGO_URL}}" alt="{{COMPANY_NAME}} Logo">
    </div>
    <h2>Hi {{USER_NAME}},</h2>
    <p>Thanks for signing up with <strong>{{COMPANY_NAME}}</strong>!</p>
    <p>To verify your email address, please use the OTP code below:</p>

    <div class="otp-box">{{OTP_CODE}}</div>

    <div class="expiration">
      This code will expire in <strong>{{EXPIRY_TIME}} minutes</strong>.
    </div>

    <p>Didn’t request this? You can ignore this email.</p>

    <div class="support">
      Need help? Reach out to us at <a href="mailto:{{SUPPORT_EMAIL}}">{{SUPPORT_EMAIL}}</a>.
    </div>

    <div class="footer">
      &copy; {{CURRENT_YEAR}} {{COMPANY_NAME}} · <a href="{{COMPANY_WEBSITE}}">{{COMPANY_WEBSITE}}</a>
    </div>
  </div>
</body>
</html>
`

    .replace("{{USER_NAME}}", USER_NAME)
    .replace("{{OTP_CODE}}", OTP_CODE)
    .replace("{{EXPIRY_TIME}}", EXPIRY_TIME);
};

export const resetPasswordTemplate = (USER_NAME, OTP_CODE, EXPIRY_TIME) => {
  return (
    `
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Reset Your Password</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f6f8;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.05);
    }
    .logo {
      text-align: center;
      margin-bottom: 20px;
    }
    .logo img {
      max-height: 60px;
    }
    h2 {
      color: #2d3748;
    }
    .otp-box {
      background-color: #edf2f7;
      padding: 20px;
      text-align: center;
      font-size: 28px;
      font-weight: bold;
      color: #2b6cb0;
      border-radius: 8px;
      width: 300px;
      margin: 0px auto 20px auto;
    }
    .reset-button {
      display: block;
      width: fit-content;
      margin: 0 auto 30px auto;
      padding: 12px 24px;
      background-color: #2b6cb0;
      color: #ffffff;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
    }
    .reset-button:hover {
      background-color: #2c5282;
    }
    .expiration {
      color: #718096;
      margin-bottom: 30px;
    }
    .support {
      font-size: 14px;
      margin-top: 20px;
    }
    .footer {
      font-size: 12px;
      color: #a0aec0;
      text-align: center;
      margin-top: 40px;
    }
    a {
      color: #2b6cb0;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <img src="{{LOGO_URL}}" alt="{{COMPANY_NAME}} Logo">
    </div>
    <h2>Hello {{USER_NAME}},</h2>
    <p>We received a request to reset your password for your <strong>{{COMPANY_NAME}}</strong> account.</p>
    <p>Use the Reset button below to reset your password:</p>

    <p href="{{RESET_LINK}}" class="reset-button">OTP CODE: {{OTP_CODE}}</p>

    <div class="expiration">
      This code will expire in <strong>{{EXPIRY_TIME}} minutes</strong>.
    </div>

    <p>If you didn’t request a password reset, you can safely ignore this email.</p>

    <div class="support">
      Need help? Contact us at <a href="mailto:{{SUPPORT_EMAIL}}">{{SUPPORT_EMAIL}}</a>.
    </div>

    <div class="footer">
      &copy; {{CURRENT_YEAR}} {{COMPANY_NAME}} · <a href="{{COMPANY_WEBSITE}}">{{COMPANY_WEBSITE}}</a>
    </div>
  </div>
</body>
</html>
`

      .replace("{{USER_NAME}}", USER_NAME)
      // .replace("{{RESET_LINK}}", RESET_LINK)
      .replace("{{EXPIRY_TIME}}", EXPIRY_TIME)
      .replace("{{OTP_CODE}}", OTP_CODE)
  );
};
