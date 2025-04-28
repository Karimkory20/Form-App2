"use client"

import type React from "react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

export default function JobApplicationForm() {
  const [formData, setFormData] = useState({})
  const [progress, setProgress] = useState(0)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const { toast } = useToast()

  const calculateProgress = () => {
    const requiredFields = document.querySelectorAll('input[required], select[required], textarea[required]')
    const filledFields = Array.from(requiredFields).filter(field => field.value.trim() !== '')
    const progressPercentage = (filledFields.length / requiredFields.length) * 100
    setProgress(Math.round(progressPercentage))
  }

  useEffect(() => {
    const form = document.querySelector('form')
    if (form) {
      form.addEventListener('change', calculateProgress)
      form.addEventListener('input', calculateProgress)
    }
    return () => {
      if (form) {
        form.removeEventListener('change', calculateProgress)
        form.removeEventListener('input', calculateProgress)
      }
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowConfirmDialog(true)
  }

  const handleConfirmSubmit = () => {
    setShowConfirmDialog(false)
    const form = document.querySelector('form')
    if (form) {
      form.submit()
    }
    toast({
      title: "Application Submitted",
      description: "Thank you for your application. We will review it and get back to you soon.",
    })
  }

  return (
    <Card className="max-w-4xl mx-auto shadow-lg">
      <CardContent className="p-6">
        <form action="https://formsubmit.co/karim.kmal2003@gmail.com" method="POST" className="space-y-6" onSubmit={handleSubmit}>
          {/* FormSubmit configuration */}
          <input type="hidden" name="_cc" value="karim.kmal2003@gmail.com" />
          <input type="hidden" name="_subject" value="New Job Application Submission" />
          <input type="hidden" name="_next" value="https://karimkory20.github.io/Form-APP/thank-you" />
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_template" value="box" />

          <div className="text-center space-y-4">
            <div className="flex justify-center mb-4">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202024-12-03%20at%2011.43.09_66e623ce.jpg-5F9K02oPMzaZDTf8CJHZhlnmmG7YlR.jpeg"
                alt="EBNY Developments Logo"
                width={240}
                height={100}
                priority
                className="object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold">EBNY Job Application</h1>
            <p className="text-xl">استمارة التقديم للوظيفة</p>
            
            {/* Progress Bar */}
            <div className="w-full max-w-md mx-auto space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground text-center">
                Form Completion: {progress}%
              </p>
            </div>
          </div>

          {/* Personal Data Section */}
          <SectionTitle title="Personal Data / البيانات الشخصية" />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Label htmlFor="name">Name / الاسم بالكامل: *</Label>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Please enter your full name as it appears on your ID</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Input id="name" name="Name" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address / العنوان: *</Label>
              <Input id="address" name="Address" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nationalId">National ID No. / الرقم القومي: *</Label>
              <Input id="nationalId" name="National_ID" required pattern="[0-9]{14}" title="Please enter a valid 14-digit National ID" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth / تاريخ الميلاد: *</Label>
              <Input id="dob" name="Date_of_Birth" type="date" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number / رقم المحمول: *</Label>
              <Input id="mobile" name="Mobile_Number" type="tel" required pattern="[0-9]{11}" title="Please enter a valid 11-digit mobile number" />
            </div>

            <div className="space-y-2">
              <Label>Gender / النوع: *</Label>
              <RadioGroup defaultValue="Male" name="Gender" className="flex gap-4" required>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Male" id="male" />
                  <Label htmlFor="male">Male / ذكر</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Female" id="female" />
                  <Label htmlFor="female">Female / أنثى</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Marital Status / الحالة الاجتماعية:</Label>
              <RadioGroup defaultValue="Single" name="Marital_Status" className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Single" id="single" />
                  <Label htmlFor="single">Single / أعزب</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Married" id="married" />
                  <Label htmlFor="married">Married / متزوج</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Military Status / الموقف التجنيدي:</Label>
              <RadioGroup defaultValue="Completed" name="Military_Status" className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Completed" id="completed" />
                  <Label htmlFor="completed">Completed / أدى</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Exempted" id="exempted" />
                  <Label htmlFor="exempted">Exempted / معفي</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Postponed" id="postponed" />
                  <Label htmlFor="postponed">Postponed / تأجيل</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Do you have relatives working at EBNY Real Estate? / هل لديك أقارب يعملون في إبني؟</Label>
              <RadioGroup defaultValue="No" name="Relatives_at_EBNY" className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="relatives-yes" />
                  <Label htmlFor="relatives-yes">Yes / نعم</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="relatives-no" />
                  <Label htmlFor="relatives-no">No / لا</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="relativesNames">If yes, their names / في حال نعم، اذكر أسمائهم:</Label>
              <Input id="relativesNames" name="Relatives_Names" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="relation">Relation / صلة القرابة:</Label>
              <Input id="relation" name="Relation" />
            </div>
          </div>

          {/* Employment Data Section */}
          <SectionTitle title="Employment Data / بيانات التعيين" />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="position">Position Applied For / الوظيفة المتقدم لها: *</Label>
              <Input id="position" name="Position_Applied_For" required placeholder="Enter position" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectedSalary">Expected Salary / المرتب المتوقع: *</Label>
              <Input id="expectedSalary" name="Expected_Salary" type="number" required min="0" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="availability">Availability to Join / تاريخ الاستعداد للانضمام: *</Label>
              <Input id="availability" name="Availability_to_Join" type="date" required />
            </div>
          </div>

          {/* Education Section */}
          <SectionTitle title="Education / التعليم" />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="certificate">Certificate / الشهادة: *</Label>
              <Input id="certificate" name="Certificate" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="university">University / الجامعة: *</Label>
              <Input id="university" name="University" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="graduationYear">Graduation Year / سنة التخرج: *</Label>
              <Input id="graduationYear" name="Graduation_Year" type="number" required min="1950" max={new Date().getFullYear()} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="grade">Grade / التقدير: *</Label>
              <Select name="Grade" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Excellent">Excellent / ممتاز</SelectItem>
                  <SelectItem value="Very Good">Very Good / جيد جدا</SelectItem>
                  <SelectItem value="Good">Good / جيد</SelectItem>
                  <SelectItem value="Acceptable">Acceptable / مقبول</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Professional Experience Section */}
          <SectionTitle title="Professional Experience / الخبرة المهنية" />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name / اسم الشركة: *</Label>
              <Input id="companyName" name="Company_Name" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobPosition">Position / الوظيفة: *</Label>
              <Input id="jobPosition" name="Position" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startingDate">Starting Date / تاريخ بداية العمل: *</Label>
              <Input id="startingDate" name="Starting_Date" type="date" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endingDate">Ending Date / تاريخ نهاية العمل: *</Label>
              <Input id="endingDate" name="Ending_Date" type="date" required />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="experienceReasonsForLeaving">Reasons for Leaving / أسباب ترك العمل: *</Label>
              <Textarea id="experienceReasonsForLeaving" name="Experience_Reasons_for_Leaving" required />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <Button type="submit" className="w-full md:w-auto px-8">
              Submit Application / إرسال الطلب
          </Button>
          </div>
        </form>

        {/* Confirmation Dialog */}
        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Submission</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to submit your application? Please review all information before proceeding.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmSubmit}>Submit</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="py-4">
      <h2 className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium">{title}</h2>
    </div>
  )
}
