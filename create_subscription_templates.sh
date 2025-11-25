#!/bin/bash

# Base directory
DEST_DIR="Original Email/subscriptions-orderly"

# This script will be called multiple times with different parameters
# Usage: ./create_subscription_templates.sh <template_name> <heading> <body_text>

TEMPLATE_NAME="$1"
HEADING="$2"
BODY_TEXT="$3"

cat > "${DEST_DIR}/${TEMPLATE_NAME}.html" << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <!--[if gte mso 15]>
      <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG />
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
    <![endif]-->
    <meta name="viewport" content="width=device-width">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="x-apple-disable-message-reformatting">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light only">
    <title>TITLE_PLACEHOLDER</title>

    <style type="text/css" id="base-premailer-ignore-css" data-premailer="ignore">
      /* Reset styles */
      html, body {
        Margin: 0 auto !important;
        padding: 0 !important;
        width: 100% !important;
      }
      * {
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
        text-rendering: optimizeLegibility;
      }
      table, th {
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
      }
      table {
        border-spacing: 0 !important;
        border-collapse: collapse !important;
        border: none;
        Margin: 0 auto;
        direction: ltr;
      }
      img {
        -ms-interpolation-mode: bicubic;
        border: none !important;
        outline: none !important;
      }
      a, a:link, a:visited {
        color: #000000;
        text-decoration: none !important;
      }
    </style>

    <!--[if !mso]><!-->
    <style type="text/css" id="google-fonts-css" data-premailer="ignore">
      @import url("https://fonts.googleapis.com/css?family=Montserrat:400,500,700&subset=latin-ext");
      [style*="Montserrat"] {
        font-family: 'Montserrat', Verdana, sans-serif !important;
      }
    </style>
    <!--<![endif]-->

    <style type="text/css" id="base-mobile-css">
      @media only screen and (max-width:480px) {
        .email-container {
          width: 100% !important;
          min-width: 100% !important;
        }
        .section_border {
          padding-right: 15px !important;
          padding-left: 15px !important;
        }
        .section_content {
          padding-right: 30px !important;
          padding-left: 30px !important;
        }
      }
    </style>
  </head>

  <body class="body" id="body" style="-webkit-text-size-adjust: none; -ms-text-size-adjust: none; Margin: 0; padding: 0;" bgcolor="#ffffff">

    <!-- HEADER CONTAINER -->
    <table class="container container_header" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse: collapse; min-width: 100%; direction: ltr; border-bottom: 1px solid #ececec;" role="presentation" bgcolor="#e7fece">
      <tbody>
        <tr>
          <th valign="top" style="mso-line-height-rule: exactly;">
            <center style="width: 100%;">
              <table border="0" width="600" cellpadding="0" cellspacing="0" align="center" style="width: 600px; min-width: 600px; max-width: 600px; direction: ltr; Margin: auto;" class="email-container" role="presentation">
                <tbody>
                  <tr>
                    <th valign="top" class="container_border" style="mso-line-height-rule: exactly;">
                      <!-- HEADER SECTION -->
                      <table class="sections_container header" border="0" width="100%" cellpadding="0" cellspacing="0" align="center" style="min-width: 100%; direction: ltr;" role="presentation" bgcolor="#e7fece">
                        <tr>
                          <td style="mso-line-height-rule: exactly;" bgcolor="#e7fece">
                            <table border="0" width="100%" cellpadding="0" cellspacing="0" align="center" style="min-width: 100%; direction: ltr;" role="presentation">
                              <tr>
                                <th class="section_border" style="mso-line-height-rule: exactly; padding: 30px;" bgcolor="#e7fece">
                                  <table border="0" width="100%" cellpadding="0" cellspacing="0" align="center" style="min-width: 100%; direction: ltr;" role="presentation">
                                    <tr>
                                      <th class="column_logo section_content" style="mso-line-height-rule: exactly; padding: 8px 30px;" align="left" bgcolor="#e7fece">
                                        <!-- Logo -->
                                        <a href="{{shop.url}}" target="_blank" style="color: #c5c5c5; text-decoration: none !important;">
                                          {%- if shop.email_logo_url %}
                                            <img src="{{shop.email_logo_url}}" alt="{{ shop.name }}" width="240" border="0" style="width: 240px; height: auto !important; display: block; Margin: 0 auto 0 0;">
                                          {%- else %}
                                            <span style="font-family: Verdana, sans-serif, 'Montserrat'; font-size: 24px; font-weight: 700; color: #304535;">{{ shop.name }}</span>
                                          {%- endif %}
                                        </a>
                                      </th>
                                    </tr>
                                  </table>
                                </th>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </th>
                  </tr>
                </tbody>
              </table>
            </center>
          </th>
        </tr>
      </tbody>
    </table>

    <!-- MAIN CONTENT CONTAINER -->
    <table class="container container_main" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse: collapse; min-width: 100%; direction: ltr;" role="presentation" bgcolor="#ffffff">
      <tbody>
        <tr>
          <th valign="top" style="mso-line-height-rule: exactly;">
            <center style="width: 100%;">
              <table border="0" width="600" cellpadding="0" cellspacing="0" align="center" style="width: 600px; min-width: 600px; max-width: 600px; direction: ltr; Margin: auto;" class="email-container" role="presentation">
                <tbody>
                  <tr>
                    <th valign="top" class="container_border" style="mso-line-height-rule: exactly;">
                      <table class="sections_container main" border="0" width="100%" cellpadding="0" cellspacing="0" align="center" style="min-width: 100%; direction: ltr;" role="presentation" bgcolor="#ffffff">
                        <tr>
                          <td style="mso-line-height-rule: exactly;" bgcolor="#ffffff">
                            <table border="0" width="100%" cellpadding="0" cellspacing="0" align="center" style="min-width: 100%; direction: ltr;" role="presentation">

                              <!-- HEADING SECTION -->
                              <tr class="section heading">
                                <th class="section_border" style="mso-line-height-rule: exactly; padding: 30px 30px 8px;" bgcolor="#ffffff">
                                  <table border="0" width="100%" cellpadding="0" cellspacing="0" align="center" style="min-width: 100%; direction: ltr;" role="presentation">
                                    <tr>
                                      <th class="section_content" style="mso-line-height-rule: exactly; padding: 8px 30px;" bgcolor="#ffffff" valign="top">
                                        <h1 style="font-family: Verdana, sans-serif, 'Montserrat'; font-size: 32px; line-height: 40px; font-weight: 500; color: #181818; text-transform: none; Margin: 0; padding: 10px 0;" align="left">HEADING_PLACEHOLDER</h1>
                                      </th>
                                    </tr>
                                  </table>
                                </th>
                              </tr>

                              <!-- INTRODUCTION SECTION -->
                              <tr class="section introduction">
                                <th class="section_border" style="mso-line-height-rule: exactly; padding: 8px 30px;" bgcolor="#ffffff">
                                  <table border="0" width="100%" cellpadding="0" cellspacing="0" align="center" style="min-width: 100%; direction: ltr;" role="presentation">
                                    <tr>
                                      <th class="section_content" style="mso-line-height-rule: exactly; padding: 8px 30px;" bgcolor="#ffffff" valign="top">
                                        <p style="mso-line-height-rule: exactly; direction: ltr; font-family: Verdana, sans-serif, 'Montserrat'; font-size: 16px; line-height: 30px; font-weight: 400; color: #555555; Margin: 0;" align="left">BODY_PLACEHOLDER</p>
                                      </th>
                                    </tr>
                                  </table>
                                </th>
                              </tr>

                              <!-- BUTTON SECTION -->
                              <tr class="section button">
                                <th class="section_border" style="mso-line-height-rule: exactly; padding: 0 30px 8px;" bgcolor="#ffffff">
                                  <table border="0" width="100%" cellpadding="0" cellspacing="0" align="center" style="min-width: 100%; direction: ltr;" role="presentation">
                                    <tr>
                                      <th class="section_content" style="mso-line-height-rule: exactly; padding: 8px 30px;" bgcolor="#ffffff" valign="top">
                                        <table cellspacing="0" cellpadding="0" border="0" role="presentation" style="direction: ltr;">
                                          <tr>
                                            <th class="column_button" style="mso-line-height-rule: exactly; Margin: 0; padding: 15px 0;" align="left" bgcolor="#ffffff" valign="top">
                                              <table cellspacing="0" cellpadding="0" border="0" class="button" role="presentation" style="direction: ltr; text-align: left; Margin: auto 0;" bgcolor="transparent">
                                                <tr>
                                                  <th class="button-inner" style="mso-line-height-rule: exactly; border-radius: 5px;" align="center" bgcolor="#4a693d" valign="top">
                                                    <a class="button-link" href="{{ subscription_contract_billing_cycle.customer_self_serve_url }}" target="_blank" style="color: #ffffff !important; text-decoration: none !important; word-wrap: break-word; line-height: 16px; font-family: Verdana, sans-serif, 'Montserrat'; font-size: 16px; font-weight: 500; text-align: center; display: block; background-color: #4a693d; border-radius: 5px; padding: 1px 20px; border: 15px solid #4a693d;">
                                                      <span style="line-height: 16px; color: #ffffff; font-weight: 500; text-decoration: none; letter-spacing: 0.5px;">Manage your subscription</span>
                                                    </a>
                                                  </th>
                                                </tr>
                                              </table>
                                            </th>
                                          </tr>
                                        </table>
                                      </th>
                                    </tr>
                                  </table>
                                </th>
                              </tr>

                            </table>
                          </td>
                        </tr>
                      </table>
                    </th>
                  </tr>
                </tbody>
              </table>
            </center>
          </th>
        </tr>
      </tbody>
    </table>

    <!-- FOOTER CONTAINER -->
    <table class="container container_footer" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse: collapse; min-width: 100%; direction: ltr; border-top: 1px solid #ececec;" role="presentation" bgcolor="#f3f3f3">
      <tbody>
        <tr>
          <th valign="top" style="mso-line-height-rule: exactly;">
            <center style="width: 100%;">
              <table border="0" width="600" cellpadding="0" cellspacing="0" align="center" style="width: 600px; min-width: 600px; max-width: 600px; direction: ltr; Margin: auto;" class="email-container" role="presentation">
                <tbody>
                  <tr>
                    <th valign="top" class="container_border" style="mso-line-height-rule: exactly;">
                      <table class="sections_container footer" border="0" width="100%" cellpadding="0" cellspacing="0" align="center" style="min-width: 100%; direction: ltr;" role="presentation" bgcolor="#f3f3f3">
                        <tr>
                          <td class="section_border" style="mso-line-height-rule: exactly; padding: 45px 30px 30px;" bgcolor="#f3f3f3">
                            <table border="0" width="100%" cellpadding="0" cellspacing="0" align="center" style="min-width: 100%; direction: ltr;" role="presentation">
                              <tr>
                                <th class="section_content" style="mso-line-height-rule: exactly; padding: 8px 30px;" bgcolor="#f3f3f3">
                                  <table border="0" width="100%" cellpadding="0" cellspacing="0" align="center" style="min-width: 100%; direction: ltr;" role="presentation">
                                    <tr>
                                      <!-- Column 1: Shop Info -->
                                      <th width="50%" style="mso-line-height-rule: exactly; padding-top: 0; padding-bottom: 0;" align="left" bgcolor="#f3f3f3" valign="top">
                                        <table align="center" border="0" width="100%" cellpadding="0" cellspacing="0" style="min-width: 100%; direction: ltr;" role="presentation">
                                          <tr>
                                            <th style="mso-line-height-rule: exactly; padding-right: 15px; font-family: Verdana, sans-serif, 'Montserrat'; font-size: 15px; line-height: 28px; font-weight: 500; color: #555555; padding-bottom: 0; padding-top: 0;" align="left" bgcolor="#f3f3f3" valign="top">
                                              <a href="{{shop.url}}" target="_blank" style="color: #181818; text-decoration: none !important; font-size: 15px; font-weight: 500;">directhomemedical.com</a>
                                            </th>
                                          </tr>
                                          <tr>
                                            <th style="mso-line-height-rule: exactly; padding-right: 15px; font-family: Verdana, sans-serif, 'Montserrat'; font-size: 15px; line-height: 28px; font-weight: 500; color: #555555; padding-top: 0; padding-bottom: 0;" align="left" bgcolor="#f3f3f3" valign="top">
                                              DirectHomeMedical<br>
                                              142 Lowell Road Suite 17 392<br>
                                              Hudson, NH 03051<br>
                                              <br>
                                              Copyright &#169; {{ 'now' | date: '%Y' }}
                                            </th>
                                          </tr>
                                        </table>
                                      </th>
                                      <!-- Column 2: Contact -->
                                      <th width="50%" style="mso-line-height-rule: exactly; padding-top: 0; padding-bottom: 0;" align="right" bgcolor="#f3f3f3" valign="top">
                                        <table align="center" border="0" width="100%" cellpadding="0" cellspacing="0" style="min-width: 100%; direction: ltr;" role="presentation">
                                          <tr>
                                            <th style="mso-line-height-rule: exactly; padding-left: 15px; font-family: Verdana, sans-serif, 'Montserrat'; font-size: 15px; line-height: 28px; font-weight: 500; color: #555555;" align="left" bgcolor="#f3f3f3" valign="top">
                                              <p style="mso-line-height-rule: exactly; font-family: Verdana, sans-serif, 'Montserrat'; font-size: 15px; line-height: 28px; font-weight: 500; color: #555555; Margin: 0;" align="left">Questions?</p>
                                              <p style="mso-line-height-rule: exactly; font-family: Verdana, sans-serif, 'Montserrat'; font-size: 14px; line-height: 26px; font-weight: 400; color: #555555; Margin: 0;" align="left">Contact us at <a href="mailto:{{ shop.email }}" style="color: #181818; text-decoration: none !important;">{{ shop.email }}</a></p>
                                            </th>
                                          </tr>
                                        </table>
                                      </th>
                                    </tr>
                                  </table>
                                </th>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </th>
                  </tr>
                </tbody>
              </table>
            </center>
          </th>
        </tr>
      </tbody>
    </table>

  </body>
</html>
EOF

# Replace placeholders
sed -i '' "s/TITLE_PLACEHOLDER/$HEADING/g" "${DEST_DIR}/${TEMPLATE_NAME}.html"
sed -i '' "s/HEADING_PLACEHOLDER/$HEADING/g" "${DEST_DIR}/${TEMPLATE_NAME}.html"
sed -i '' "s|BODY_PLACEHOLDER|$BODY_TEXT|g" "${DEST_DIR}/${TEMPLATE_NAME}.html"

