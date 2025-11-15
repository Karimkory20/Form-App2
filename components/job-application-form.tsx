"use client"

import type React from "react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { CardContent } from "@/components/ui/card"
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
import { Plus, Trash2 } from "lucide-react"

// --- Helper Types for Dynamic Fields ---

type Experience = {
  id: number
  companyName: string
  position: string
  startingDate: string
  endingDate: string
  reasonsForLeaving: string
}

type Course = {
  id: number
  courseName: string
  institution: string
  startingDate: string
  endingDate: string
  totalHours: string
}

// --- Dynamic Field Helper Components ---

interface ExperienceEntryProps {
  index: number
  experience: Experience
  handleRemove: (id: number) => void
  isLast: boolean
}

const ExperienceEntry: React.FC<ExperienceEntryProps> = ({ index, experience, handleRemove, isLast }) => (
  <div className="border p-4 rounded-md space-y-4 relative col-span-full">
    <h4 className="font-semibold text-lg text-blue-600 mb-4">Experience #{index + 1}</h4>
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor={`companyName-${experience.id}`}>Company Name / اسم الشركة: *</Label>
        {/* Note: The 'name' attribute uses an array notation for FormSubmit/server-side parsing */}
        <Input id={`companyName-${experience.id}`} name={`Experience[${index}][CompanyName]`} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`jobPosition-${experience.id}`}>Position / الوظيفة: *</Label>
        <Input id={`jobPosition-${experience.id}`} name={`Experience[${index}][Position]`} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`startingDate-${experience.id}`}>Starting Date / تاريخ بداية العمل: *</Label>
        <Input id={`startingDate-${experience.id}`} name={`Experience[${index}][StartingDate]`} type="date" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`endingDate-${experience.id}`}>Ending Date / تاريخ نهاية العمل: *</Label>
        <Input id={`endingDate-${experience.id}`} name={`Experience[${index}][EndingDate]`} type="date" required />
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor={`experienceReasonsForLeaving-${experience.id}`}>Reasons for Leaving / أسباب ترك العمل: *</Label>
        <Textarea id={`experienceReasonsForLeaving-${experience.id}`} name={`Experience[${index}][ReasonsForLeaving]`} required />
      </div>
    </div>
    {/* Only allow removal if it's not the first (required) entry */}
    {index > 0 && (
      <Button
        type="button"
        variant="destructive"
        size="sm"
        className="absolute top-2 right-2"
        onClick={() => handleRemove(experience.id)}
      >
        <Trash2 className="h-4 w-4 mr-2" /> Remove
      </Button>
    )}
  </div>
)

interface CourseEntryProps {
  index: number
  course: Course
  handleRemove: (id: number) => void
  isLast: boolean
}

const CourseEntry: React.FC<CourseEntryProps> = ({ index, course, handleRemove, isLast }) => (
  <div className="border p-4 rounded-md space-y-4 relative col-span-full">
    <h4 className="font-semibold text-lg text-blue-600 mb-4">Course #{index + 1}</h4>
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor={`courseName-${course.id}`}>Course Name / اسم الدورة:</Label>
        <Input id={`courseName-${course.id}`} name={`Course[${index}][CourseName]`} />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`institution-${course.id}`}>Institution / مركز التدريب:</Label>
        <Input id={`institution-${course.id}`} name={`Course[${index}][Institution]`} />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`courseStartingDate-${course.id}`}>Starting Date / تاريخ بداية الدورة:</Label>
        <Input id={`courseStartingDate-${course.id}`} name={`Course[${index}][StartingDate]`} type="date" />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`courseEndingDate-${course.id}`}>Ending Date / تاريخ نهاية الدورة:</Label>
        <Input id={`courseEndingDate-${course.id}`} name={`Course[${index}][EndingDate]`} type="date" />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`totalHours-${course.id}`}>Total Hours / عدد الساعات:</Label>
        <Input id={`totalHours-${course.id}`} name={`Course[${index}][TotalHours]`} type="number" min="1" />
      </div>
    </div>
    {index > 0 && (
      <Button
        type="button"
        variant="destructive"
        size="sm"
        className="absolute top-2 right-2"
        onClick={() => handleRemove(course.id)}
      >
        <Trash2 className="h-4 w-4 mr-2" /> Remove
      </Button>
    )}
  </div>
)

// --- Main Component ---

export default function JobApplicationForm() {
  // Use state to manage multiple experiences and courses
  const [experiences, setExperiences] = useState<Experience[]>([{
    id: Date.now(), companyName: '', position: '', startingDate: '', endingDate: '', reasonsForLeaving: ''
  }])
  const [courses, setCourses] = useState<Course[]>([{
    id: Date.now() + 1, courseName: '', institution: '', startingDate: '', endingDate: '', totalHours: ''
  }])
  const [progress, setProgress] = useState(0)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const { toast } = useToast()

  const calculateProgress = () => {
    const requiredFields = document.querySelectorAll('input[required], select[required], textarea[required]')
    const filledFields = Array.from(requiredFields).filter((field: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => field.value.trim() !== '')
    const progressPercentage = (filledFields.length / requiredFields.length) * 100
    setProgress(Math.round(progressPercentage))
  }

  useEffect(() => {
    // Recalculate progress on component mount/update to catch initial required fields
    calculateProgress()
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
  }, [experiences, courses]) // Dependency arrays to recalculate when fields change

  // --- Dynamic Field Handlers ---

  const addExperience = () => {
    setExperiences(prev => [...prev, {
      id: Date.now(), companyName: '', position: '', startingDate: '', endingDate: '', reasonsForLeaving: ''
    }])
  }

  const removeExperience = (id: number) => {
    setExperiences(prev => prev.filter(exp => exp.id !== id))
  }

  const addCourse = () => {
    setCourses(prev => [...prev, {
      id: Date.now(), courseName: '', institution: '', startingDate: '', endingDate: '', totalHours: ''
    }])
  }

  const removeCourse = (id: number) => {
    setCourses(prev => prev.filter(course => course.id !== id))
  }

  // --- Submission Handlers ---

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Perform HTML5 form validation checks
    const form = e.currentTarget as HTMLFormElement;
    if (!form.checkValidity()) {
        form.reportValidity();
        toast({
            title: "Validation Error",
            description: "Please fill out all required fields marked with *.",
            variant: "destructive"
        })
        return;
    }
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
        <form action="https://formsubmit.co/kkamal@ebny.com.eg" method="POST" className="space-y-6" onSubmit={handleSubmit}>
          {/* FormSubmit configuration */}
          <input type="hidden" name="_cc" value="karim.kmal2003@gmail.com" />
          <input type="hidden" name="_subject" value="New Job Application Submission" />
          <input type="hidden" name="_next" value="/thank-you" />
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

          {/* 1. Personal Data Section */}
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
              <Label htmlFor="email">Email Address / البريد الإلكتروني: *</Label>
              <Input id="email" name="Email_Address" type="email" required placeholder="name@example.com" />
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
              <RadioGroup name="Gender" className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Male" id="male" required />
                  <Label htmlFor="male">Male / ذكر</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Female" id="female" required />
                  <Label htmlFor="female">Female / أنثى</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Marital Status / الحالة الاجتماعية:</Label>
              <RadioGroup name="Marital_Status" className="flex gap-4">
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

            <div className="space-y-2 md:col-span-2">
              <Label>Military Status / الموقف التجنيدي:</Label>
              <RadioGroup name="Military_Status" className="flex flex-wrap gap-4">
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
              <RadioGroup name="Relatives_at_EBNY" className="flex gap-4">
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

          {/* 2. Employment Data Section */}
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

          {/* 3. Education Section */}
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

          {/* 4. Professional Experience Section (Dynamic) */}
          <SectionTitle title="Professional Experience / الخبرة المهنية" />
          
          <div className="space-y-6">
            {experiences.map((experience, index) => (
              <ExperienceEntry
                key={experience.id}
                index={index}
                experience={experience}
                handleRemove={removeExperience}
                isLast={index === experiences.length - 1}
              />
            ))}
            <div className="flex justify-end">
              <Button type="button" variant="outline" onClick={addExperience}>
                <Plus className="h-4 w-4 mr-2" /> Add Another Experience / إضافة خبرة أخرى
              </Button>
            </div>
          </div>
          
          {/* 5. Training Courses Section (Dynamic) */}
          <SectionTitle title="Training Courses / الدورات التدريبية" />

          <div className="space-y-6">
            {courses.map((course, index) => (
              <CourseEntry
                key={course.id}
                index={index}
                course={course}
                handleRemove={removeCourse}
                isLast={index === courses.length - 1}
              />
            ))}
            <div className="flex justify-end">
              <Button type="button" variant="outline" onClick={addCourse}>
                <Plus className="h-4 w-4 mr-2" /> Add Another Course / إضافة دورة أخرى
              </Button>
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
