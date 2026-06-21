# Payment Gateway API (Reseller System)

আপনার AlphaZero সাইটের UddoktaPay gateway ব্যবহার করে অন্য ওয়েবসাইটগুলো payment নিতে পারবে। প্রতিটা client website একটা **API key** পাবে — সেই key দিয়ে payment session তৈরি করবে, user আপনার সাইটে এসে pay করবে, success হলে client site verification করে access দেবে।

## Flow

```
Client Site → POST /api-create-payment (API key + amount + redirect_url)
            ← { payment_url, invoice_id }
User → আপনার hosted UddoktaPay checkout এ pay করে
     → success হলে redirect → client site (with invoice_id)
Client Site → GET /api-verify-payment?invoice_id=... (API key)
            ← { status: "paid", amount, customer, paid_at }
```

## Database (new tables)

- **api_clients** — id, name, owner_email, api_key (hashed), is_active, created_at
- **api_payments** — id, client_id, invoice_id (unique), amount, currency, customer_name, customer_email, status (pending/paid/failed), uddoktapay_invoice_id, metadata (jsonb), redirect_url, webhook_url, paid_at, created_at

RLS: শুধু admin দেখতে/manage করতে পারবে। Edge functions service_role দিয়ে কাজ করবে।

## Edge Functions (3 টি, public — verify_jwt off)

1. **api-create-payment** — API key validate → UddoktaPay checkout তৈরি → payment_url return
2. **api-verify-payment** — API key + invoice_id দিয়ে status return
3. **api-payment-callback** — UddoktaPay থেকে callback → DB update → optional webhook fire to client site

## Admin UI (AdminDashboard এ নতুন tab)

- **API Clients** management — নতুন client add, API key generate (একবার দেখাবে), enable/disable, revoke
- **API Payments** log — সব transaction দেখা, filter by client

## Security

- API key SHA-256 hash করে store, request এ `Authorization: Bearer <key>` header
- Rate limiting handled by Supabase
- Webhook signature (HMAC) optional — client site verify করতে পারবে
- Amount + currency server-side validate

## Docs page

`/api-docs` route — Bengali + English এ usage examples (curl, JS) দেখাবে যাতে client sites সহজে integrate করতে পারে।

## Technical details

- UddoktaPay integration reuse from existing `uddoktapay-checkout` / `uddoktapay-verify` functions
- `metadata` জুড়ে `api_client_id` ও `external_invoice_id` রাখা হবে যাতে callback এ chain করা যায়
- Client redirect URL এ `?invoice_id=...&status=paid` query append হবে
