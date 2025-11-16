import { NextRequest, NextResponse } from 'next/server'

// Formspree form endpoint - set FORMSPREE_ID environment variable
const FORMSPREE_ID = process.env.FORMSPREE_ID

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

    // Send form data to Formspree
    const recipientEmail = process.env.RECIPIENT_EMAIL || 'kkamal@ebny.com.eg'

    try {
      if (!FORMSPREE_ID) {
        throw new Error('FORMSPREE_ID environment variable is not set')
      }

      // Prepare form data for Formspree
      const formspreeData = new FormData()
      
      // Add all flattened form fields
      Object.entries(data).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          // For arrays, add each item
          value.forEach((item, index) => {
            if (typeof item === 'object') {
              // For nested objects, flatten them
              Object.entries(item).forEach(([subKey, subValue]) => {
                formspreeData.append(`${key}[${index}][${subKey}]`, String(subValue))
              })
            } else {
              formspreeData.append(`${key}[${index}]`, String(item))
            }
          })
        } else if (typeof value === 'object') {
          // For objects, add each key-value pair
          Object.entries(value).forEach(([subKey, subValue]) => {
            formspreeData.append(`${key}[${subKey}]`, String(subValue))
          })
        } else {
          formspreeData.append(key, String(value))
        }
      })

      // Add email field for Formspree
      formspreeData.append('email', data.Email_Address || recipientEmail)
      formspreeData.append('_subject', 'New Job Application Submission - EBNY')
      formspreeData.append('_replyto', data.Email_Address || recipientEmail)

      // Send to Formspree
      const formspreeResponse = await fetch(`https://formspree.io/f/mnnlgqga`, {
        method: 'POST',
        body: formspreeData,
      })

      if (!formspreeResponse.ok) {
        console.error('Formspree error:', formspreeResponse.status, formspreeResponse.statusText)
        throw new Error(`Formspree submission failed: ${formspreeResponse.statusText}`)
      }

      console.log('Form submitted successfully to Formspree')
    } catch (emailError) {
      console.error('Error submitting form:', emailError)
      // Don't fail the request if submission fails, but log it
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