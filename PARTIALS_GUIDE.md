# Email Partials Guide

Complete guide to using partials in the DHM email template system.

## Available Partials

### Core Structure Partials

#### `head.html`
Complete HTML head section with all styles and meta tags.

**Includes:**
- Meta tags for email client compatibility
- All CSS styles (base, mobile responsive, custom)
- MSO conditional tags for Outlook
- Preview text configuration
- Opening body tag and first container

**Variables:**
- `{{email_title}}` - Email subject/title
- `{{preview_text}}` - Preview text in inbox
- `{{email_type}}` - Email type for tracking

**Usage:**
```html
{{> head }}
```

#### `header.html`
Logo section with left alignment.

**Includes:**
- DirectHomeMedical logo (240px width)
- Green background (#e7fed0)
- Responsive mobile layout
- Liquid variable: `{{shop.email_logo_url}}`

**Usage:**
```html
{{> header }}
```

#### `container-open.html`
Opens the main content container (600px width, white background).

**Usage:**
```html
{{> container-open }}
```

#### `container-close.html`
Closes the main content container and opens footer container.

**Usage:**
```html
{{> container-close }}
```

#### `body-close.html`
Closes body and html tags.

**Usage:**
```html
{{> body-close }}
```

### Footer Partials

#### `footer-long.html`
Full footer with return policy and insurance information.

**Use for:**
- Order confirmations
- Subscription order confirmations
- Any email related to physical products/orders

**Includes:**
- Return address
- Product return policy
- FREE Satisfaction Guarantee details
- Insurance claim information
- Copyright notice
- Tracking pixel

**Usage:**
```html
{{> footer-long }}
```

#### `footer-short.html`
Simple footer with just copyright.

**Use for:**
- Subscription status emails (paused, canceled, etc.)
- Payment reminders
- Account notifications
- Non-order transactional emails

**Includes:**
- Copyright notice
- Tracking pixel

**Usage:**
```html
{{> footer-short }}
```

#### `footer.html` (deprecated)
Original footer partial. Use `footer-long.html` instead.

### Content Partials

#### `order-items.html`
Product list section with line items, images, quantities, and pricing.

**Use for:**
- Order confirmations
- Subscription order confirmations
- Any email displaying products purchased

**Includes:**
- Product images (120px width with rounded corners)
- Product titles and variant information
- Quantity display
- Price display (with strikethrough for discounts)
- Prescription required badges
- Subscription plan information
- Discount allocations
- Bold subscription integration support

**Variables:**
- `line_items` - Can be `order.line_items` or `subscription_contract_billing_cycle.line_items`
- Works with Shopify product metafields for additional info

**Usage:**
```html
{{> order-items }}
```

**Note:** The partial expects `line_items` to be available in scope. For subscriptions, you may need to assign it:
```liquid
{% assign line_items = subscription_contract_billing_cycle.line_items %}
{{> order-items }}
```

#### `customer-info.html`
Two-column layout displaying shipping and billing addresses.

**Use for:**
- Order confirmations
- Subscription order confirmations
- Any email requiring customer address display

**Includes:**
- Left column: Shipping address
- Right column: Billing address/Customer info
- Phone number display with "Tel." label
- Automatic fallback to customer.default_address if billing_address is blank
- Responsive layout (stacks on mobile)

**Variables:**
- `shipping_address` - Shopify shipping address object
- `billing_address` - Shopify billing address object
- `customer` - Shopify customer object (fallback)

**Usage:**
```html
{{> customer-info }}
```

**Mobile behavior:** The two columns automatically stack on mobile devices for better readability.

## Template Structure

### Basic Email Structure

Every email template follows this structure:

```html
{{> head }}
                      {{> header }}
                      {{> container-open }}

                      <!-- YOUR CONTENT HERE -->

                      {{> container-close }}
                      {{> footer-short }}
                    </th>
                  </tr>
                </tbody>
              </table>
            </center>
          </th>
        </tr>
      </tbody>
    </table>
{{> body-close }}
```

### Complete Example

```html
{{> head }}
                      {{> header }}
                      {{> container-open }}

                      <!-- BEGIN: MAIN CONTENT -->
                      <table
                        class="sections_container"
                        border="0"
                        width="100%"
                        cellpadding="0"
                        cellspacing="0"
                        align="center"
                        style="min-width: 100%; direction: ltr"
                        role="presentation"
                      >
                        <tr>
                          <th
                            class="section_border"
                            style="mso-line-height-rule: exactly; padding: 45px 30px"
                            bgcolor="#ffffff"
                          >
                            <table
                              border="0"
                              width="100%"
                              cellpadding="0"
                              cellspacing="0"
                              align="center"
                              style="min-width: 100%; direction: ltr"
                              role="presentation"
                            >
                              <tr>
                                <th
                                  class="section_content"
                                  style="
                                    mso-line-height-rule: exactly;
                                    direction: ltr;
                                    font-family: Verdana, sans-serif, 'Montserrat';
                                    font-size: 18px;
                                    line-height: 28px;
                                    font-weight: 400;
                                    color: #333333;
                                    padding: 8px 30px;
                                  "
                                  align="left"
                                >
                                  <h2 style="font-size: 24px; margin: 0 0 20px 0; color: #4a693d;">
                                    Your Subscription Was Paused
                                  </h2>
                                  <p>Your subscription has been paused...</p>
                                </th>
                              </tr>
                            </table>
                          </th>
                        </tr>
                      </table>
                      <!-- END: MAIN CONTENT -->

                      {{> container-close }}
                      {{> footer-short }}
                    </th>
                  </tr>
                </tbody>
              </table>
            </center>
          </th>
        </tr>
      </tbody>
    </table>
{{> body-close }}
```

### Using Content Partials (order-items & customer-info)

For emails that display orders or subscriptions with product details and customer information:

```html
{{> head }}
{{> header }}
{{> container-open }}

<!-- YOUR MESSAGE CONTENT -->
<table class="sections_container" ...>
  <tr>
    <th class="section_border" ...>
      <h2>Thank you for your subscription order!</h2>
      <p>Your order has been confirmed and will ship soon.</p>
    </th>
  </tr>
</table>

<!-- PRODUCT LIST -->
{% assign line_items = subscription_contract_billing_cycle.line_items %}
{{> order-items }}

<!-- SHIPPING & BILLING ADDRESSES -->
{{> customer-info }}

{{> container-close }}
{{> footer-long }}
...
{{> body-close }}
```

**Key points:**
- Use `{{> order-items }}` to display product list with images and pricing
- Use `{{> customer-info }}` to show shipping/billing in two columns
- For subscriptions, assign `line_items` from subscription object first
- For regular orders, `line_items` is already available as `order.line_items`
- These partials work together or independently

## Choosing the Right Footer

### Use `footer-long.html` for:
- ✅ Order confirmations
- ✅ Shipping confirmations
- ✅ Delivery notifications
- ✅ Subscription order confirmations
- ✅ Any email where customer receives products

### Use `footer-short.html` for:
- ✅ Subscription paused
- ✅ Subscription canceled
- ✅ Subscription resumed
- ✅ Payment failed
- ✅ Payment reminders
- ✅ Account notifications
- ✅ Status updates (no products involved)

## Creating a New Email Template

1. **Create template file** in `src/templates/` (or subdirectory):
   ```bash
   touch src/templates/my-new-email.html
   ```

2. **Start with basic structure:**
   ```html
   {{> head }}
                         {{> header }}
                         {{> container-open }}

                         <!-- YOUR CONTENT -->

                         {{> container-close }}
                         {{> footer-short }}
                       </th>
                     </tr>
                   </tbody>
                 </table>
               </center>
             </th>
           </tr>
         </tbody>
       </table>
   {{> body-close }}
   ```

3. **Add your content** between `container-open` and `container-close`

4. **Build:**
   ```bash
   npm run build
   ```

5. **Test:**
   ```bash
   npm run test-email -- dist/my-new-email.html
   ```

## Customizing Partials

### Changing Logo Alignment

Edit `src/partials/header.html`:

```html
<!-- Left aligned (current) -->
<img class="logo logo-left logo-mobile-left" ... />

<!-- Center aligned -->
<img class="logo logo-center logo-mobile-center" ... />

<!-- Right aligned -->
<img class="logo logo-right logo-mobile-right" ... />
```

### Modifying Footer Text

Edit either:
- `src/partials/footer-long.html` - For detailed footer
- `src/partials/footer-short.html` - For simple footer

### Updating Styles

Edit `src/partials/head.html` - All CSS is in the `<style>` tags.

## Troubleshooting

### Partial not found error

```
<!-- PARTIAL NOT FOUND: footer-long -->
```

**Solution:** Check partial name spelling and ensure file exists in `src/partials/`

### Footer appearing twice

**Problem:** Using both `{{> footer-long }}` and `{{> footer-short }}` in same template

**Solution:** Choose only one footer partial per template

### Closing tags mismatch

**Problem:** Template structure is broken

**Solution:** Ensure you use all container partials in correct order:
1. `{{> head }}`
2. `{{> header }}`
3. `{{> container-open }}`
4. Your content
5. `{{> container-close }}`
6. Footer partial
7. Closing tags (included in footer)
8. `{{> body-close }}`

## Advanced: Converting Existing Emails

Use the conversion script for subscription emails:

```bash
node convert-subscriptions.js
```

This automatically:
1. Extracts content from original Shopify templates
2. Wraps content in new partial structure
3. Outputs to `src/templates/subscriptions/`

## File Structure

```
src/
├── partials/
│   ├── head.html              # HTML head + styles
│   ├── header.html            # Logo section
│   ├── container-open.html    # Opens main container
│   ├── container-close.html   # Closes main, opens footer container
│   ├── footer-long.html       # Full footer with policies
│   ├── footer-short.html      # Simple copyright footer
│   ├── body-close.html        # Closes body + html
│   ├── order-items.html       # Product list with images/pricing
│   └── customer-info.html     # Two-column shipping/billing addresses
└── templates/
    ├── test-email.html
    └── subscriptions/
        ├── subscription-canceled.html
        ├── subscription-paused.html
        ├── subscription-order-confirmation.html
        └── ...
```

## Best Practices

1. **Always use partials** - Don't duplicate header/footer code
2. **Choose correct footer** - Long for orders, short for notifications
3. **Test in Mailtrap** - Before deploying to Shopify
4. **Keep content simple** - Complex CSS breaks in email clients
5. **Preserve Liquid tags** - Don't remove Shopify variables
6. **Use consistent styling** - Follow existing patterns in templates

## Resources

- [Main README](README.md) - Project overview
- [Quick Start Guide](QUICK_START.md) - Getting started
- [Mailtrap Setup](MAILTRAP_SETUP.md) - Testing emails
