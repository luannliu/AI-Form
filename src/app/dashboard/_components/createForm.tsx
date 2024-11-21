'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog"

import { AiChatSession } from '../../../../configs/AIModal'
import { useUser } from '@clerk/nextjs'
import { db } from '../../../../configs'
import { JsonForms } from '../../../../configs/schema'
import moment from 'moment';
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

function CreateForm() {
    const [openDialog, setOpenDialog] = useState(false)
    const [openAlert, setOpenAlert] = useState(false)
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const { user } = useUser()
    const route = useRouter()
    const onCreateForm = async () => {
        if (input.length > 0) {
            // setOpenDialog(false)
        } else {
            setOpenAlert(true)
        }
        setLoading(true)
        const result = await AiChatSession(input).then((res) => {
            // console.log(res.choices, res.choices[0].message.content, 'result')
            return res.choices[0].message.content
        })
        if (result) {
            // 数据库操作 configs中schema文件中定义的表结构
            const resp = await db.insert(JsonForms).values({
                jsonform: result,
                createBy: user?.primaryEmailAddress?.emailAddress!,
                createdAt: moment().format('YYYY-MM-DD')
            }).returning({ id: JsonForms.id });
            console.log(db.insert(JsonForms), 'resp.id')
            if (resp[0].id) {
                route.push(`/forms/${resp[0].id}`)
            }
            setLoading(false)
        }
        setLoading(false)
    }

    return (
        <div>
            <Button onClick={() => setOpenDialog(true)} className=' text-white px-4 py-2 rounded-md'>+ Creat Form</Button>
            <Dialog open={openDialog} >
                <DialogContent className='rounded-xl'>
                    <DialogHeader>
                        <DialogTitle>Create new form</DialogTitle>
                        <DialogDescription>
                            <Textarea className='my-4'
                                onChange={(e) => setInput(e.target.value.trim())} placeholder='please write description of your form ' />
                            <span className='pt-2 flex items-center justify-around'>
                                <Button
                                    onClick={() => {
                                        setOpenDialog(false)
                                    }} className=' text-primary bg-primary/15 px-4 py-2 rounded-md hover:text-white'>
                                    Cancle
                                </Button>
                                <Button disabled={loading} onClick={onCreateForm} className=' text-white px-4 py-2 rounded-md'>{loading ? <Loader2 className='animate-spin'/> : 'Create'}</Button>
                            </span>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            <AlertDialog open={openAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Alert</AlertDialogTitle>
                        <AlertDialogDescription>please write description of your form
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setOpenAlert(false)}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default CreateForm


