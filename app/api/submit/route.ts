import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// Initialize Resend with API key from environment variable
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Convert FormData to a plain object for easier handling
    const data: Record<string, any> = {}
    formData.forEach((value, key) => {
      // Handle array fields (Experience, Course)
      if (key.includes('[') && key.includes(']')) {
        const match = key.match(/^(\w+)\[(\d+)\]\[(\w+)\]$/)
        if (match) {
          const [, arrayName, index, fieldName] = match
          if (!data[arrayName]) {
            data[arrayName] = []
          }
          if (!data[arrayName][parseInt(index)]) {
            data[arrayName][parseInt(index)] = {}
          }
          data[arrayName][parseInt(index)][fieldName] = value.toString()
        } else {
          data[key] = value.toString()
        }
      } else {
        // Handle regular fields
        if (data[key]) {
          // If key already exists, convert to array
          if (Array.isArray(data[key])) {
            data[key].push(value.toString())
          } else {
            data[key] = [data[key], value.toString()]
          }
        } else {
          data[key] = value.toString()
        }
      }
    })

    // Log the submission (for testing/debugging)
    console.log('Form submission received:', JSON.stringify(data, null, 2))

    // Format email content
    const emailBody = formatEmailBody(data)
    const emailHtml = formatEmailHtml(data)

    // Send email using Resend
    const recipientEmail = process.env.RECIPIENT_EMAIL || 'kkamal@ebny.com.eg'
    const ccEmail = process.env.CC_EMAIL || recipientEmail

    try {
      // Use a properly formatted FROM email
      // Resend requires either:
      // 1. A verified domain email (e.g., noreply@yourdomain.com)
      // 2. Or the format: "Name <email@domain.com>"
      const fromEmail = process.env.FROM_EMAIL || 'EBNY <onboarding@resend.dev>'
      
      const emailResult = await resend.emails.send({
        from: fromEmail,
        to: [recipientEmail],
        cc: ccEmail !== recipientEmail ? [ccEmail] : undefined,
        subject: 'New Job Application Submission - EBNY',
        text: emailBody,
        html: emailHtml,
      })

      console.log('Email sent successfully:', emailResult)
    } catch (emailError) {
      console.error('Error sending email:', emailError)
      // Don't fail the request if email fails, but log it
      // You might want to handle this differently based on your needs
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Application submitted successfully!'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error processing form submission:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to submit application. Please try again.' 
      },
      { status: 500 }
    )
  }
}

function formatEmailBody(data: Record<string, any>): string {
  let body = 'New Job Application Submission\n\n'
  body += '='.repeat(50) + '\n\n'

  // Personal Data
  body += 'PERSONAL DATA\n'
  body += '-'.repeat(50) + '\n'
  body += `Name: ${data.Name || 'N/A'}\n`
  body += `Email: ${data.Email_Address || 'N/A'}\n`
  body += `Address: ${data.Address || 'N/A'}\n`
  body += `National ID: ${data.National_ID || 'N/A'}\n`
  body += `Date of Birth: ${data.Date_of_Birth || 'N/A'}\n`
  body += `Mobile: ${data.Mobile_Number || 'N/A'}\n`
  body += `Gender: ${data.Gender || 'N/A'}\n`
  body += `Marital Status: ${data.Marital_Status || 'N/A'}\n`
  body += `Military Status: ${data.Military_Status || 'N/A'}\n`
  body += `Relatives at EBNY: ${data.Relatives_at_EBNY || 'N/A'}\n`
  if (data.Relatives_Names) body += `Relatives Names: ${data.Relatives_Names}\n`
  if (data.Relation) body += `Relation: ${data.Relation}\n`
  body += '\n'

  // Employment Data
  body += 'EMPLOYMENT DATA\n'
  body += '-'.repeat(50) + '\n'
  body += `Position Applied For: ${data.Position_Applied_For || 'N/A'}\n`
  body += `Expected Salary: ${data.Expected_Salary || 'N/A'}\n`
  body += `Availability to Join: ${data.Availability_to_Join || 'N/A'}\n`
  body += '\n'

  // Education
  body += 'EDUCATION\n'
  body += '-'.repeat(50) + '\n'
  body += `Certificate: ${data.Certificate || 'N/A'}\n`
  body += `University: ${data.University || 'N/A'}\n`
  body += `Graduation Year: ${data.Graduation_Year || 'N/A'}\n`
  body += `Grade: ${data.Grade || 'N/A'}\n`
  body += '\n'

  // Professional Experience
  if (data.Experience && Array.isArray(data.Experience)) {
    body += 'PROFESSIONAL EXPERIENCE\n'
    body += '-'.repeat(50) + '\n'
    data.Experience.forEach((exp: any, index: number) => {
      body += `\nExperience #${index + 1}:\n`
      body += `  Company: ${exp.CompanyName || 'N/A'}\n`
      body += `  Position: ${exp.Position || 'N/A'}\n`
      body += `  Starting Date: ${exp.StartingDate || 'N/A'}\n`
      body += `  Ending Date: ${exp.EndingDate || 'N/A'}\n`
      body += `  Reasons for Leaving: ${exp.ReasonsForLeaving || 'N/A'}\n`
    })
    body += '\n'
  }

  // Training Courses
  if (data.Course && Array.isArray(data.Course)) {
    body += 'TRAINING COURSES\n'
    body += '-'.repeat(50) + '\n'
    data.Course.forEach((course: any, index: number) => {
      body += `\nCourse #${index + 1}:\n`
      body += `  Course Name: ${course.CourseName || 'N/A'}\n`
      body += `  Institution: ${course.Institution || 'N/A'}\n`
      body += `  Starting Date: ${course.StartingDate || 'N/A'}\n`
      body += `  Ending Date: ${course.EndingDate || 'N/A'}\n`
      body += `  Total Hours: ${course.TotalHours || 'N/A'}\n`
    })
  }

  return body
}

function formatEmailHtml(data: Record<string, any>): string {
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Job Application</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #1e40af; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0;">New Job Application Submission</h1>
        <p style="margin: 5px 0 0 0; opacity: 0.9;">EBNY Real Estate Development</p>
      </div>
      
      <div style="background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
        
        <h2 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 10px; margin-top: 0;">Personal Data</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <tr><td style="padding: 8px; font-weight: bold; width: 200px;">Name:</td><td style="padding: 8px;">${escapeHtml(data.Name || 'N/A')}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;">${escapeHtml(data.Email_Address || 'N/A')}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Address:</td><td style="padding: 8px;">${escapeHtml(data.Address || 'N/A')}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">National ID:</td><td style="padding: 8px;">${escapeHtml(data.National_ID || 'N/A')}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Date of Birth:</td><td style="padding: 8px;">${escapeHtml(data.Date_of_Birth || 'N/A')}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Mobile:</td><td style="padding: 8px;">${escapeHtml(data.Mobile_Number || 'N/A')}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Gender:</td><td style="padding: 8px;">${escapeHtml(data.Gender || 'N/A')}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Marital Status:</td><td style="padding: 8px;">${escapeHtml(data.Marital_Status || 'N/A')}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Military Status:</td><td style="padding: 8px;">${escapeHtml(data.Military_Status || 'N/A')}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Relatives at EBNY:</td><td style="padding: 8px;">${escapeHtml(data.Relatives_at_EBNY || 'N/A')}</td></tr>
          ${data.Relatives_Names ? `<tr><td style="padding: 8px; font-weight: bold;">Relatives Names:</td><td style="padding: 8px;">${escapeHtml(data.Relatives_Names)}</td></tr>` : ''}
          ${data.Relation ? `<tr><td style="padding: 8px; font-weight: bold;">Relation:</td><td style="padding: 8px;">${escapeHtml(data.Relation)}</td></tr>` : ''}
        </table>

        <h2 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 10px;">Employment Data</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <tr><td style="padding: 8px; font-weight: bold; width: 200px;">Position Applied For:</td><td style="padding: 8px;">${escapeHtml(data.Position_Applied_For || 'N/A')}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Expected Salary:</td><td style="padding: 8px;">${escapeHtml(data.Expected_Salary || 'N/A')}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Availability to Join:</td><td style="padding: 8px;">${escapeHtml(data.Availability_to_Join || 'N/A')}</td></tr>
        </table>

        <h2 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 10px;">Education</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <tr><td style="padding: 8px; font-weight: bold; width: 200px;">Certificate:</td><td style="padding: 8px;">${escapeHtml(data.Certificate || 'N/A')}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">University:</td><td style="padding: 8px;">${escapeHtml(data.University || 'N/A')}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Graduation Year:</td><td style="padding: 8px;">${escapeHtml(data.Graduation_Year || 'N/A')}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Grade:</td><td style="padding: 8px;">${escapeHtml(data.Grade || 'N/A')}</td></tr>
        </table>
  `

  // Professional Experience
  if (data.Experience && Array.isArray(data.Experience)) {
    html += `
        <h2 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 10px;">Professional Experience</h2>
    `
    data.Experience.forEach((exp: any, index: number) => {
      html += `
        <div style="background-color: white; padding: 15px; margin-bottom: 15px; border-left: 4px solid #1e40af; border-radius: 4px;">
          <h3 style="margin-top: 0; color: #1e40af;">Experience #${index + 1}</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; font-weight: bold; width: 200px;">Company:</td><td style="padding: 8px;">${escapeHtml(exp.CompanyName || 'N/A')}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Position:</td><td style="padding: 8px;">${escapeHtml(exp.Position || 'N/A')}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Starting Date:</td><td style="padding: 8px;">${escapeHtml(exp.StartingDate || 'N/A')}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Ending Date:</td><td style="padding: 8px;">${escapeHtml(exp.EndingDate || 'N/A')}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Reasons for Leaving:</td><td style="padding: 8px;">${escapeHtml(exp.ReasonsForLeaving || 'N/A')}</td></tr>
          </table>
        </div>
      `
    })
  }

  // Training Courses
  if (data.Course && Array.isArray(data.Course)) {
    html += `
        <h2 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 10px; margin-top: 30px;">Training Courses</h2>
    `
    data.Course.forEach((course: any, index: number) => {
      html += `
        <div style="background-color: white; padding: 15px; margin-bottom: 15px; border-left: 4px solid #1e40af; border-radius: 4px;">
          <h3 style="margin-top: 0; color: #1e40af;">Course #${index + 1}</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; font-weight: bold; width: 200px;">Course Name:</td><td style="padding: 8px;">${escapeHtml(course.CourseName || 'N/A')}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Institution:</td><td style="padding: 8px;">${escapeHtml(course.Institution || 'N/A')}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Starting Date:</td><td style="padding: 8px;">${escapeHtml(course.StartingDate || 'N/A')}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Ending Date:</td><td style="padding: 8px;">${escapeHtml(course.EndingDate || 'N/A')}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Total Hours:</td><td style="padding: 8px;">${escapeHtml(course.TotalHours || 'N/A')}</td></tr>
          </table>
        </div>
      `
    })
  }

  html += `
      </div>
      <div style="margin-top: 20px; padding: 15px; background-color: #f3f4f6; border-radius: 8px; text-align: center; color: #6b7280; font-size: 12px;">
        <p style="margin: 0;">This email was automatically generated from the EBNY Job Application Form</p>
      </div>
    </body>
    </html>
  `

  return html
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

