# Checkout Redirect & Klaviyo Integration Guide

This guide provides the exact script and steps needed to redirect coaching customers automatically to Calendly after a successful checkout, and configure Klaviyo for confirmation emails and questionnaires.

---

## Part 1: Automated Post-Payment Redirect (Shopify Admin)

This script will automatically intercept customers on the Shopify "Thank You" (Order Status) page, show a premium redirect modal matching the Expat Teacher's Lounge branding, and send them to the corresponding Calendly page with their **Name** and **Email** pre-filled.

### Implementation Steps:
1. In your **Shopify Admin**, go to **Settings** -> **Checkout**.
2. Scroll down to the **Order status page** section.
3. Paste the following snippet into the **Additional scripts** box:
4. Click **Save**.

### Copy-Paste Code:
```html
{%- assign has_redirect = false -%}
{%- assign redirect_url = '' -%}
{%- assign redirect_message = '' -%}
{%- assign redirect_button_text = 'Click here if you are not redirected' -%}

{%- for line in order.line_items -%}
  {%- assign product_title = line.product.title | downcase -%}
  {%- if product_title contains 'relocation strategy' -%}
    {%- assign has_redirect = true -%}
    {%- assign redirect_url = 'https://calendly.com/expatteacherslounge-info/relocation-strategy-session' -%}
    {%- assign redirect_message = 'Redirecting you to book your relocation strategy session...' -%}
  {%- elsif product_title contains 'contract review' -%}
    {%- assign has_redirect = true -%}
    {%- assign redirect_url = 'https://calendly.com/expatteacherslounge-info/relocation-strategy-session-clone' -%}
    {%- assign redirect_message = 'Redirecting you to book your contract review session...' -%}
  {%- elsif product_title contains 'pathways' or product_title contains 'application kit' -%}
    {%- assign has_redirect = true -%}
    {%- assign redirect_url = 'https://golden-cocada-4a4070.netlify.app' -%}
    {%- assign redirect_message = 'Redirecting you to access your Pathways Application Kit...' -%}
  {%- elsif product_title contains 'province picker' -%}
    {%- assign has_redirect = true -%}
    {%- assign redirect_url = 'https://glistening-pixie-6b1c76.netlify.app' -%}
    {%- assign redirect_message = 'Redirecting you to access your Canada Province Picker...' -%}
  {%- elsif product_title contains 'certification guide' or product_title contains 'interactive' and product_title contains 'certification' -%}
    {%- assign has_redirect = true -%}
    {%- assign redirect_url = 'https://cosmic-biscochitos-3b4cc1.netlify.app' -%}
    {%- assign redirect_message = 'Redirecting you to access your Interactive Certification Guide...' -%}
  {%- elsif product_title contains 'roadmap' or product_title contains 'certification roadmap' -%}
    {%- assign has_redirect = true -%}
    {%- assign redirect_url = 'https://stirring-beijinho-d6d251.netlify.app' -%}
    {%- assign redirect_message = 'Redirecting you to access your Certification Roadmap...' -%}
  {%- endif -%}
{%- endfor -%}

{%- if has_redirect and redirect_url != '' -%}
  <!-- Premium Redirect Overlay -->
  <div id="coaching-redirect-overlay" style="position: fixed; inset: 0; background: #0a0b14; z-index: 999999; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-align: center; padding: 20px;">
    <!-- Circular Spinner -->
    <div style="width: 80px; height: 80px; border: 4px solid rgba(28, 145, 215, 0.1); border-top-color: #1C91D7; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 32px;"></div>
    
    <h2 style="font-size: 2rem; font-weight: 800; margin: 0 0 16px 0; color: #ffffff;">Payment Successful!</h2>
    <p style="font-size: 1.125rem; color: rgba(255, 255, 255, 0.7); max-width: 480px; margin: 0 0 32px 0; line-height: 1.5;">
      {{ redirect_message }}
    </p>
    
    {%- if redirect_url contains 'calendly.com' -%}
      {%- assign final_url = redirect_url | append: '?name=' | append: (order.customer.name | url_encode) | append: '&email=' | append: (order.customer.email | url_encode) -%}
    {%- else -%}
      {%- assign final_url = redirect_url -%}
    {%- endif -%}
    
    <a href="{{ final_url }}" style="background: #1C91D7; color: #ffffff; text-decoration: none; padding: 16px 36px; border-radius: 9999px; font-weight: 700; font-size: 1rem; box-shadow: 0 10px 20px rgba(28, 145, 215, 0.25); transition: all 0.3s ease;">
      {{ redirect_button_text }}
    </a>
  </div>

  <style>
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  </style>

  <script>
    setTimeout(function() {
      var redirectUrl = "{{ final_url }}";
      window.location.href = redirectUrl;
    }, 2000);
  </script>
{%- endif -%}
```

---

## Part 2: Calendly & Klaviyo Confirmation Flow

To automatically email the customer their booking confirmation along with the intake questionnaire *after* they book on Calendly, use the native integrations.

### Step 1: Connect Calendly to Klaviyo
1. Log into your **Klaviyo** account.
2. Go to **Integrations** -> **All Integrations** and search for **Calendly**.
3. Follow the connection prompts and authorize access. 
*Once connected, Calendly will sync scheduled events directly to Klaviyo as a custom metric/trigger called **"Scheduled Calendly Event"**.*

### Step 2: Create the Intake Email Flow in Klaviyo
1. In Klaviyo, navigate to **Flows** -> **Create Flow**.
2. Select **Create from Scratch**. Name the flow `Coaching Booking Confirmation & Questionnaire`.
3. Set the flow trigger to **Metric** and choose **"Scheduled Calendly Event"** (or similar event name synced by Calendly).
4. Add a **Trigger Split** condition to separate the flows by package if you use separate questionnaires:
   - Check the event properties (e.g., `Event Type Name` contains `Contract Review` vs `Relocation Strategy`).
5. Add an **Email** action block:
   - Edit the email with a premium header matching your brand colors.
   - Dynamically prefill their appointment details in the email (e.g., using `{{ event.start_time }}`).
   - Include a clear button linking to your Google Form, Typeform, or questionnaire URL.
6. Set the flow to **Live**.
