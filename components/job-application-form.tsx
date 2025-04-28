"use client"

import type React from "react"
import Image from "next/image"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

export default function JobApplicationForm() {
  const [formData, setFormData] = useState({})

  const handleSubmit = (e: React.FormEvent) => {
    // You can add any additional client-side logic here if needed
    // The form will be submitted directly to FormSubmit
  }

  return (
    <Card className="max-w-4xl mx-auto shadow-lg">
      <CardContent className="p-6">
        <form action="https://formsubmit.co/hr@ebny.com.eg" method="POST" className="space-y-6">
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
            <h1 className="text-2xl font-bold">Job Application Form</h1>
            <p className="text-xl">استمارة التقديم للوظيفة</p>
          </div>

          {/* Personal Data Section */}
          <SectionTitle title="Personal Data / البيانات الشخصية" />

          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name / الاسم بالكامل:</Label>
              <Input id="name" name="Name" required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Address / العنوان:</Label>
              <Input id="address" name="Address" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="nationalId">National ID No. / الرقم القومي:</Label>
              <Input id="nationalId" name="National_ID" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dob">Date of Birth / تاريخ الميلاد:</Label>
              <Input id="dob" name="Date_of_Birth" type="date" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="mobile">Mobile Number / رقم المحمول:</Label>
              <Input id="mobile" name="Mobile_Number" type="tel" />
            </div>

            <div className="grid gap-2">
              <Label>Gender / النوع:</Label>
              <RadioGroup defaultValue="Male" name="Gender" className="flex gap-4">
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

            <div className="grid gap-2">
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

            <div className="grid gap-2">
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

            <div className="grid gap-2">
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

            <div className="grid gap-2">
              <Label htmlFor="relativesNames">If yes, their names / في حال نعم، اذكر أسمائهم:</Label>
              <Input id="relativesNames" name="Relatives_Names" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="relation">Relation / صلة القرابة:</Label>
              <Input id="relation" name="Relation" />
            </div>
          </div>

          {/* Employment Data Section */}
          <SectionTitle title="Employment Data / بيانات التعيين" />

          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="position">Position Applied For / الوظيفة المتقدم لها:</Label>
              <Input id="position" name="Position_Applied_For" />
            </div>

            <div className="grid gap-2">
              <Label>Are you currently employed? / هل تعمل حاليا؟</Label>
              <RadioGroup defaultValue="No" name="Currently_Employed" className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="employed-yes" />
                  <Label htmlFor="employed-yes">Yes / نعم</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="employed-no" />
                  <Label htmlFor="employed-no">No / لا</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="currentSalary">If yes, your current salary / اذا نعم، اذكر مرتبك الحالي:</Label>
              <Input id="currentSalary" name="Current_Salary" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="expectedSalary">Expected Salary / المرتب المتوقع:</Label>
              <Input id="expectedSalary" name="Expected_Salary" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="availability">Availability to Join / تاريخ الاستعداد للانضمام:</Label>
              <Input id="availability" name="Availability_to_Join" type="date" />
            </div>

            <div className="grid gap-2">
              <Label>Have you ever been employed at EBNY Real Estate before? / هل عملت سابقا بابني؟</Label>
              <RadioGroup defaultValue="No" name="Previous_Employment_at_EBNY" className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="previous-yes" />
                  <Label htmlFor="previous-yes">Yes / نعم</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="previous-no" />
                  <Label htmlFor="previous-no">No / لا</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="previousPosition">If yes, what position? / في حال نعم، اذكر اخر وظيفة:</Label>
              <Input id="previousPosition" name="Previous_Position" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reasonsForLeaving">Reasons for Leaving / سبب ترك العمل:</Label>
              <Input id="reasonsForLeaving" name="Reasons_for_Leaving" />
            </div>
          </div>

          {/* Education Section */}
          <SectionTitle title="Education / التعليم" />

          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="certificate">Certificate / الشهادة:</Label>
              <Input id="certificate" name="Certificate" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="university">University / الجامعة:</Label>
              <Input id="university" name="University" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="graduationYear">Graduation Year / سنة التخرج:</Label>
              <Input id="graduationYear" name="Graduation_Year" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="grade">Grade / التقدير:</Label>
              <Input id="grade" name="Grade" />
            </div>
          </div>

          {/* Professional Experience Section */}
          <SectionTitle title="Professional Experience / الخبرة المهنية" />

          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="companyName">Company Name / اسم الشركة:</Label>
              <Input id="companyName" name="Company_Name" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="jobPosition">Position / الوظيفة:</Label>
              <Input id="jobPosition" name="Position" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="startingDate">Starting Date / تاريخ بداية العمل:</Label>
              <Input id="startingDate" name="Starting_Date" type="date" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="endingDate">Ending Date / تاريخ نهاية العمل:</Label>
              <Input id="endingDate" name="Ending_Date" type="date" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="experienceReasonsForLeaving">Reasons for Leaving / أسباب ترك العمل:</Label>
              <Input id="experienceReasonsForLeaving" name="Experience_Reasons_for_Leaving" />
            </div>
          </div>

          {/* Training Courses Section */}
          <SectionTitle title="Training Courses / الدورات التدريبية" />

          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="courseName">Course Name / اسم الدورة:</Label>
              <Input id="courseName" name="Course_Name" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="institution">Institution / مركز التدريب:</Label>
              <Input id="institution" name="Institution" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="courseStartingDate">Starting Date / تاريخ بداية الدورة:</Label>
              <Input id="courseStartingDate" name="Course_Starting_Date" type="date" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="courseEndingDate">Ending Date / تاريخ نهاية الدورة:</Label>
              <Input id="courseEndingDate" name="Course_Ending_Date" type="date" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="totalHours">Total Hours / عدد الساعات:</Label>
              <Input id="totalHours" name="Total_Hours" />
            </div>
          </div>

          {/* Languages Section */}
          <SectionTitle title="Languages / اللغات" />

          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="language1">Language 1:</Label>
              <Input id="language1" name="Language_1" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="language1Level">Proficiency Level:</Label>
              <Select name="Language_1_Level">
                <SelectTrigger>
                  <SelectValue placeholder="Select proficiency level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Excellent">Excellent / ممتاز</SelectItem>
                  <SelectItem value="Very Good">Very Good / جيد جدا</SelectItem>
                  <SelectItem value="Good">Good / جيد</SelectItem>
                  <SelectItem value="Fair">Fair / مقبول</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="language2">Language 2:</Label>
              <Input id="language2" name="Language_2" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="language2Level">Proficiency Level:</Label>
              <Select name="Language_2_Level">
                <SelectTrigger>
                  <SelectValue placeholder="Select proficiency level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Excellent">Excellent / ممتاز</SelectItem>
                  <SelectItem value="Very Good">Very Good / جيد جدا</SelectItem>
                  <SelectItem value="Good">Good / جيد</SelectItem>
                  <SelectItem value="Fair">Fair / مقبول</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Computer Skills Section */}
          <SectionTitle title="Computer Skills / مهارات الحاسب الالي" />

          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="skill1">Program/Skill 1:</Label>
              <Input id="skill1" name="Skill_1" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="skill1Level">Proficiency Level:</Label>
              <Select name="Skill_1_Level">
                <SelectTrigger>
                  <SelectValue placeholder="Select proficiency level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Excellent">Excellent / ممتاز</SelectItem>
                  <SelectItem value="Very Good">Very Good / جيد جدا</SelectItem>
                  <SelectItem value="Good">Good / جيد</SelectItem>
                  <SelectItem value="Fair">Fair / مقبول</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="skill2">Program/Skill 2:</Label>
              <Input id="skill2" name="Skill_2" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="skill2Level">Proficiency Level:</Label>
              <Select name="Skill_2_Level">
                <SelectTrigger>
                  <SelectValue placeholder="Select proficiency level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Excellent">Excellent / ممتاز</SelectItem>
                  <SelectItem value="Very Good">Very Good / جيد جدا</SelectItem>
                  <SelectItem value="Good">Good / جيد</SelectItem>
                  <SelectItem value="Fair">Fair / مقبول</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-lg py-6">
            Submit / ارسال
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="py-2">
      <h2 className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium">{title}</h2>
    </div>
  )
}
