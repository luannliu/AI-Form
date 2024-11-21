'use client'
import React, { useEffect, useState } from 'react'
import { Edit, Trash2 } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface FieldEditProps {
  defaultValue: {
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
  }
  onUpdate: (value: {
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
  }) => void;
  deleteField: () => void;
}

// 通过使用 React.FC 和 FieldEditProps 接口，确保组件的 props 使用正确，并且享受 TypeScript 提供的类型检查和自动完成功能。
// function FieldEdit({ defaultValue,onUpdate }: FieldEditProps) 
const FieldEdit: React.FC<FieldEditProps> = ({ defaultValue, onUpdate, deleteField }) => {
  const [label, setLabel] = useState(defaultValue.label)
  const [placeholder, setPlaceholder] = useState(defaultValue.placeholder)
  const [openAlert, setOpenAlert] = useState(false)
  const [openPopover, setOpenPopover] = useState(false);

  return (
    <div>
      <div className='flex gap-2 ml-3'>
        <Popover open={openPopover}>
          <PopoverTrigger>
            <Edit onClick={() => { setOpenPopover(!openPopover) }} className='h-5 w-5 text-gray-300 ' /></PopoverTrigger>
          <PopoverContent>
            <h2 className='text-sm text-gray-400'>Edit field</h2>
            <div>
              <label className='text-xs'>labelName</label>
              <Input type='text' defaultValue={label} onChange={(e) => setLabel(e.target.value)} className='w-full' />
            </div>
            <div>
              <label className='text-xs'>pleceholder</label>
              <Input type='text' defaultValue={placeholder} onChange={(e) => setPlaceholder(e.target.value)} className='w-full' />
            </div>
            <Button size='sm' onClick={() => {
              onUpdate({
                ...defaultValue,//展开所有默认值
                label,
                placeholder, // 更新属性
              }); setOpenPopover(false)
            }} className='w-full mt-3'>Save</Button>
          </PopoverContent>
        </Popover>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Trash2 className='h-5 w-5 text-red-500 ' />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => {
                deleteField(); setOpenPopover(false)
              }}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>

  )
}

export default FieldEdit