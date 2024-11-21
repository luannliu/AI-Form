'use client'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { db } from '../../../../configs'
import { JsonForms } from '../../../../configs/schema'
import { eq } from 'drizzle-orm'
import FormUI from '@/app/forms/_components/formUI'
import Image from 'next/image'
import Link from 'next/link'

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

function FormView() {
    const params = useParams()
    const [record, setRecord] = useState({} as dbForm)
    const [formData, setFormData] = useState<FormData>({
        formTitle: '',
        formHeading: '',
        formFields: []
    });
    useEffect(() => { params && GetFormData() }, [params])
    const GetFormData = async () => {
        try {
            const result = await db.select().from(JsonForms)
                .where(eq(JsonForms.id, Number(params?.formId)))
            console.log(result, 'getViewResult')
            setRecord(result[0] as dbForm)

            setFormData(JSON.parse(result[0].jsonform))

        } catch (error) {
            console.error('Failed to fetch form data:', error);
        }
    }
    return (
        <div className='md:col-span-2 border rounded-lg p-5  flex items-center justify-center' style={{ background: record.background }}>
            <div className='bg-white'>
                <FormUI formData={formData}
                    selectedTheme={record.theme}
                    selectedStyle={record.style}
                    enableEdit={false}
                    formId={record.id}
                    onFieldUpdate={() => console.log} onFieldDelete={() => console.log} />
            </div>
            <Link href={'/'} className='flex gap-2 items-center justify-center bg-black text-white px-3 py-1 rounded-full fixed bottom-5 left-5 cursor-pointer'>
                <Image src={'/logo.png'} width={20} height={20} alt='' />Build your own AI Forms
            </Link>
        </div>
    )
}

export default FormView