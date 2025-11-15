import { NextRequest, NextResponse } from 'next/server'

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

    // TODO: Add email sending logic here
    // You can use services like:
    // - Resend (https://resend.com)
    // - SendGrid
    // - Nodemailer with SMTP
    // - Or any other email service

    // For now, we'll just return success
    // In production, you would send an email here
    const emailBody = formatEmailBody(data)
    
    // Simulate email sending (replace with actual email service)
    // await sendEmail({
    //   to: 'kkamal@ebny.com.eg',
    //   cc: 'kkamal@ebny.com.eg',
    //   subject: 'New Job Application Submission',
    //   body: emailBody
    // })

    return NextResponse.json(
      { 
        success: true, 
        message: 'Application submitted successfully!',
        // Include the data for testing (remove in production)
        data: data
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

