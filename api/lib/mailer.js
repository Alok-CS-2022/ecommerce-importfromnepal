import { Resend } from 'resend';

// Initialize Resend with API key from environment variable
// const resend = new Resend(process.env.RESEND_API_KEY);
const resend = new Resend('re_ANbBMVzW_5etBpjnXcRuK9bw6Yaw1mvXm');

/**
 * Send order confirmation email to admins
 * @param {Object} options - Email options
 * @param {Array<string>} options.to - Array of recipient emails
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text content
 * @param {string} options.html - HTML content
 * @param {string} options.attachmentName - Attachment filename
 * @param {string} options.attachmentContent - Attachment content
 */
export async function sendOrderEmail({ to, subject, text, html, attachmentName, attachmentContent }) {
    try {
        const data = await resend.emails.send({
            from: 'Import From Nepal <orders@importfromnepal.com>', // You can customize this
            to: to,
            subject: subject,
            text: text,
            html: html,
            attachments: attachmentName && attachmentContent ? [
                {
                    filename: attachmentName,
                    content: Buffer.from(attachmentContent).toString('base64'),
                }
            ] : undefined,
        });

        console.log('✅ Order email sent successfully:', data);
        return data;
    } catch (error) {
        console.error('❌ Error sending order email:', error);
        // Don't throw error - we don't want order creation to fail if email fails
        return null;
    }
}

/**
 * Format order data into a nice HTML email
 * @param {Object} order - Order object from database
 */
export function formatOrderEmailHTML(order) {
    // Parse items if it's a string
    let items = [];
    try {
        items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
    } catch (e) {
        console.error('Error parsing items:', e);
    }

    const itemsHTML = Array.isArray(items) && items.length > 0
        ? items.map(item => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name || 'Unknown'}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity || 1}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price || 0).toFixed(2)}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">$${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</td>
            </tr>
        `).join('')
        : '<tr><td colspan="4" style="padding: 10px; text-align: center; color: #999;">No items</td></tr>';

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Order - Import From Nepal</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">🎉 New Order Received!</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px;">Import From Nepal</p>
    </div>
    
    <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #667eea; margin-top: 0; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Order Details</h2>
            <p><strong>Order ID:</strong> #${String(order.id).substring(0, 8)}</p>
            <p><strong>Date:</strong> ${new Date(order.created_at).toLocaleString()}</p>
            <p><strong>Status:</strong> <span style="background: #fbbf24; color: white; padding: 4px 12px; border-radius: 4px; font-size: 12px; text-transform: uppercase;">${order.status || 'pending'}</span></p>
        </div>

        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #667eea; margin-top: 0; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Customer Information</h2>
            <p><strong>Name:</strong> ${order.customer_name || 'N/A'}</p>
            <p><strong>Email:</strong> <a href="mailto:${order.customer_email}" style="color: #667eea;">${order.customer_email || 'N/A'}</a></p>
            <p><strong>Phone:</strong> ${order.customer_phone || 'N/A'}</p>
            <p><strong>Country:</strong> ${order.customer_country || 'N/A'}</p>
            <p><strong>Address:</strong><br>${order.customer_address || 'N/A'}<br>${order.customer_city || ''}, ${order.customer_state || ''} ${order.customer_zip || ''}</p>
        </div>

        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #667eea; margin-top: 0; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Order Items</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #f3f4f6;">
                        <th style="padding: 10px; text-align: left; border-bottom: 2px solid #667eea;">Item</th>
                        <th style="padding: 10px; text-align: center; border-bottom: 2px solid #667eea;">Qty</th>
                        <th style="padding: 10px; text-align: right; border-bottom: 2px solid #667eea;">Price</th>
                        <th style="padding: 10px; text-align: right; border-bottom: 2px solid #667eea;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHTML}
                </tbody>
            </table>
        </div>

        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #667eea; margin-top: 0; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Order Summary</h2>
            <table style="width: 100%;">
                <tr>
                    <td style="padding: 8px 0;">Subtotal:</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: bold;">$${(order.subtotal || 0).toFixed(2)}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0;">Shipping:</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: bold;">$${(order.shipping_cost || 0).toFixed(2)}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0;">Tax:</td>
                    <td style="padding: 8px 0; text-align: right; font-weight: bold;">$${(order.tax || 0).toFixed(2)}</td>
                </tr>
                <tr style="border-top: 2px solid #667eea;">
                    <td style="padding: 12px 0; font-size: 18px; font-weight: bold;">Total:</td>
                    <td style="padding: 12px 0; text-align: right; font-size: 18px; font-weight: bold; color: #667eea;">$${(order.total_amount || 0).toFixed(2)}</td>
                </tr>
            </table>
        </div>

        ${order.special_requests ? `
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #667eea; margin-top: 0; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Special Requests</h2>
            <p style="background: #f3f4f6; padding: 15px; border-radius: 4px; border-left: 4px solid #667eea;">${order.special_requests}</p>
        </div>
        ` : ''}

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #666; font-size: 14px;">This is an automated notification from Import From Nepal</p>
            <p style="color: #666; font-size: 14px;">Please do not reply to this email</p>
        </div>
    </div>
</body>
</html>
    `;
}