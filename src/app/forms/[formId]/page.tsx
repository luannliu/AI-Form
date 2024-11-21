'use client'
import React, { useEffect, useState } from 'react'
import { db } from '../../../../configs'
import { JsonForms } from '../../../../configs/schema'
import { and, eq } from 'drizzle-orm'
import { useUser } from '@clerk/nextjs'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Share2, SquareArrowOutUpRight } from 'lucide-react'
import FormUI from '../_components/formUI'
import { useToast } from "@/hooks/use-toast"
import Controller from '../_components/Controller'
import { Button } from '@/components/ui/button'

interface dbForm {
    id: number;
    jsonform: string;
    theme: string;
    background: string;
    style: string;
    createBy: string;
    createdAt: string;
}
interface FormData {
    formTitle: string;
    formHeading: string;
    formFields: Array<{
        label: string;
        placeholder: string;
        fieldName?: string;
        fieldTitle?: string;
        fieldType?: string;
        required?: boolean;
        options?: Array<{
            value: string;
            text: string;
        }>;
    }>;
    [key: string]: unknown;
}
function Forms() {
    const params = useParams()
    const { user } = useUser()
    const route = useRouter()
    const [formData, setFormData] = useState<FormData>({
        formTitle: '',
        formHeading: '',
        formFields: []
    });
    const [updateTrigger, setUpdateTrigger] = useState('')
    const [record, setRecord] = useState({} as dbForm)
    const { toast } = useToast()
    const [selectedTheme, setSelectedTheme] = useState('light')
    const [selectedBg, setSelectedBg] = useState('')
    const [selectedStyle, setSelectedStyle] = useState('default')

    useEffect(() => { user && GetFormData() }, [user])
    const GetFormData = async () => {
        try {
            const result = await db.select().from(JsonForms)
                .where(
                    and(
                        eq(JsonForms.id, Number(params?.formId)),
                        eq(JsonForms.createBy, user?.primaryEmailAddress!.emailAddress!),
                    )
                )
            console.log(result, 'getResult')
            setRecord(result[0] as dbForm)
            setFormData(JSON.parse(result[0].jsonform))
            setSelectedBg(result[0]?.background ?? '')
            setSelectedTheme(result[0]?.theme ?? 'light')
            setSelectedStyle(result[0]?.style ?? '')
        } catch (error) {
            console.error('Failed to fetch form data:', error);
        }
    }
    useEffect(() => {
        if (updateTrigger) {
            // 更新状态
            setFormData(formData);
            // 更新数据库
            updateIndb()
        }
    }, [updateTrigger])

    const onFieldUpdate = (value: FormData['formFields'][0], index: number) => {
        // 深拷贝 formData.formFields数组以创建新的数组
        const updatedFields = [...formData.formFields];
        // 更新指定索引的字段
        updatedFields[index] = {
            ...updatedFields[index], // 展开原始字段以保留所有现有属性
            ...value, // 展开要更新的值，这将覆盖原始字段中的任何相同属性
        };
        formData.formFields = updatedFields
        setUpdateTrigger(Date.now().toString())
    }

    const onFieldDelete = (index: number) => {
        // 深拷贝 formData.formFields数组以创建新的数组
        const updatedFields = [...formData.formFields];
        // 删除指定索引的字段
        updatedFields.splice(index, 1);
        formData.formFields = updatedFields
        setUpdateTrigger(Date.now().toString())
    }
    // 更新表单数据到数据库
    const updateIndb = async () => {
        try {
            const result = await db.update(JsonForms)
                .set({ jsonform: JSON.stringify(formData) })
                .where(
                    and(
                        eq(JsonForms.id, record.id),
                        eq(JsonForms.createBy, user?.primaryEmailAddress!.emailAddress!),
                    )
                )
            console.log(result, 'upDateResult')
            toast({
                title: 'Update success',
                description: 'Form data updated successfully.',
            })
        } catch (error) {
            console.error('Failed to update form data:', error);
        }
    }
    // 更新表单样式到数据库
    const updateUIIndb = async (value: string, type: string) => {
        try {
            const result = await db.update(JsonForms)
                .set({ [type]: value })
                .where(
                    and(
                        eq(JsonForms.id, record.id),
                        eq(JsonForms.createBy, user?.primaryEmailAddress!.emailAddress!),
                    )
                )
            console.log(result, 'upUIResult')
            toast({
                title: 'Update success',
                description: 'Form UI updated successfully.',
            })
        }
        catch (error) {
            console.error('Failed to update form UI:', error);
        }
    }
    const formPreview = () => {
        // route.push(`/formView/${params?.formId}`)
        window.open(`/formView/${params.formId}`, '_blank');
    }
    const formShare = () => {
        // route.push(`/formView/${params?.formId}/share`)
    }

    return (
        <div className='p-10'>
            <h2 className='flex justify-between gap-2 items-center my-5 cursor-pointer hover:font-bold'>
                <div className='flex'><ArrowLeft className='pb-0.5' onClick={() => route.back()} />Back</div>
                <div className='flex gap-2'>
                    <Button variant='outline' onClick={() => formPreview()}><SquareArrowOutUpRight />Live Preview</Button>
                    <Button className='bg-green-500' variant='outline' onClick={() => formShare()}><Share2 />Share</Button>
                </div>
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                <div className='p-5 border rounded-lg shadow-gray-200'>
                    <Controller selectedUI={{ selectedTheme: selectedTheme, selectedBg: selectedBg, selectedStyle: selectedStyle }}
                        selectTheme={(value) => {
                            updateUIIndb(value, 'theme'); setSelectedTheme(value)
                        }}
                        selectBg={(value) => { updateUIIndb(value, 'background'); setSelectedBg(value); }}
                        selectStyle={(value) => { updateUIIndb(value, 'style'); setSelectedStyle(value); }} />
                </div>
                <div className='md:col-span-2 border rounded-lg p-5  flex items-center justify-center' style={{ background: selectedBg }}>
                    <FormUI formData={formData}
                        selectedTheme={selectedTheme}
                        selectedStyle={selectedStyle}
                        enableEdit={true}
                        onFieldUpdate={onFieldUpdate} onFieldDelete={onFieldDelete} />
                </div>
            </div>
        </div>
    )
}

export default Forms