/// <reference no-default-lib="true" />
/// <reference lib="esnext" />
/// <reference lib="deno.ns" />

const BREVO_API_KEY = Deno.env.get('BREVO_API_KEY')

Deno.serve(async (req) => {
  try {
    const payload = await req.json()
    const { record, table } = payload
    const adminEmail = "graphoriacreativitydesign@gmail.com"

    let subject = ""
    let htmlContent = ""

    // Identify if it's an inquiry or an error based on the table name
    if (table === 'inquiries') {
      subject = `New Project Inquiry: ${record.full_name}`
      htmlContent = `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #00ff88;">New Inquiry Received</h2>
          <p><strong>Name:</strong> ${record.full_name}</p>
          <p><strong>Email:</strong> ${record.email}</p>
          <p><strong>Project:</strong> ${record.project_type}</p>
          <p><strong>Budget:</strong> ${record.budget || 'Not specified'}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #f4f4f4; padding: 15px; border-left: 4px solid #00ff88;">
            ${record.message}
          </div>
          <p style="margin-top: 20px; font-size: 12px; color: #888;">Received from Graphoria Studio Contact Form</p>
        </div>
      `
    } else if (table === 'error_logs') {
      subject = `⚠️ System Error on Graphoria`
      htmlContent = `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #ff4d4d;">Application Error Detected</h2>
          <p><strong>Error Message:</strong> ${record.message}</p>
          <p><strong>Path:</strong> ${record.path}</p>
          <p><strong>Severity:</strong> ${record.severity}</p>
          <p><strong>User Agent:</strong> ${record.user_agent}</p>
          <div style="background: #f4f4f4; padding: 15px; border-left: 4px solid #ff4d4d; font-family: monospace; font-size: 12px; overflow-x: auto;">
            ${record.stack || 'No stack trace available'}
          </div>
        </div>
      `
    } else if (table === 'contracts') {
      subject = `📄 New Signed Contract: ${record.project_name}`
      htmlContent = `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #00ff88;">Contract Agreement Signed</h2>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 12px; border: 1px solid #eee;">
            <p><strong>Project:</strong> <span style="font-size: 18px; font-weight: bold;">${record.project_name}</span></p>
            <p><strong>Client:</strong> ${record.client_name}</p>
            <p><strong>Budget:</strong> ₹${record.budget}</p>
            <p><strong>Client Email:</strong> ${record.client_email}</p>
            <p><strong>Client Phone:</strong> ${record.client_phone}</p>
            <p><strong>Digital Signature:</strong> <span style="font-family: serif; font-style: italic; font-weight: bold;">${record.client_signature}</span></p>
          </div>
          <div style="margin-top: 25px; text-align: center;">
            <a href="${record.pdf_url}" style="background: #00ff88; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 30px; font-weight: bold; display: inline-block;">View Signed PDF</a>
          </div>
          <p style="margin-top: 30px; font-size: 11px; color: #aaa; text-align: center;">Automated notification from Graphoria Contract System</p>
        </div>
      `
    } else {
      // Generic notification for any other table
      subject = `Graphoria Database Update: ${table}`
      htmlContent = `<p>New record in ${table}</p><pre>${JSON.stringify(record, null, 2)}</pre>`
    }

    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY || '',
      },
      body: JSON.stringify({
        sender: { name: "Graphoria System", email: "graphoriacreativitydesign@gmail.com" },
        to: [{ email: adminEmail }],
        subject: subject,
        htmlContent: htmlContent,
      }),
    })

    const result = await res.json()
    return new Response(JSON.stringify(result), { 
      headers: { 'Content-Type': 'application/json' },
      status: res.status
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { 
      headers: { 'Content-Type': 'application/json' },
      status: 500
    })
  }
})
