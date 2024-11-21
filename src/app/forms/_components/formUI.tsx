import React, { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import FieldEdit from './fieldEdit'
import Style from '@/app/_data/Style'
import { Button } from '@/components/ui/button'
import { userResponse } from '../../../../configs/schema'
import { db } from '../../../../configs'
import moment from 'moment'
import { useToast } from '@/hooks/use-toast'

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

interface FormUIProps {
  formData: FormData;
  selectedTheme: string;
  selectedStyle: string;
  enableEdit: boolean;
  formId?: number;
  onFieldUpdate: (value: FormData['formFields'][0], index: number) => void;
  onFieldDelete: (index: number) => void;
}

interface OptionType {
  value: string | boolean;
  text: string;
}

function FormUI({ formData, selectedTheme, selectedStyle, enableEdit,formId=0, onFieldUpdate, onFieldDelete }: FormUIProps) {
  const styleItem = Style.find(item => item.name === selectedStyle)
  type checkArray = Array<OptionType>;
  const { toast } = useToast()
  // 定义jsonform
  const [jsonform, setJsonForm] = useState<FormData>(() => ({
    formTitle: '',
    formHeading: '',
    formFields: []
  }))
  // 初始化表单数据
  useEffect(() => {
    setJsonForm({
      formTitle: formData?.formTitle,
      formHeading: formData?.formHeading,
      formFields: formData?.formFields
    });
  }, [formData]);
  //模拟组件的重新挂载
  useEffect(() => {
    console.log('Component re-rendered');
  }, [jsonform.formFields])

  // 获取input数据
  const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setJsonForm({
      ...jsonform,
      [name]: value
    })
  }
  // 获取select和 Radio数据
  const selectChange = (value: string, name: string) => {
    setJsonForm({
      ...jsonform,
      [name]: value
    })
  }

  // 获取checkbox数据
  const checkboxChange = (fieldName: string, itemName: string, value: string | boolean) => {
    const list = (jsonform[fieldName] as unknown as Array<{ value: string | boolean; text: string; }>) || [];
    if (value) {
      list.push({
        value: value,
        text: itemName
      })
      setJsonForm({
        ...jsonform,
        [fieldName]: list
      })
    } else {
      const result = list.filter((item) => item.text !== itemName)
      setJsonForm({
        ...jsonform,
        [fieldName]: result
      })
    }
  }

  //数据校验
  const validateCheckbox = () => {
    // 获取所有 required 为 true 的 checkbox及radio组
    const FieldArray = jsonform.formFields?.filter((item) => (item.fieldType === 'checkbox' || 'radio') && item.required);
    // 新建只包含 fieldName 和 required 属性的新数组
    const requiredFields = FieldArray?.map((item) => ({
      fieldName: item.fieldName,
      required: item.required
    }));
    // 收集所有未满足条件的 fieldName
    const emptyNames = requiredFields
      .filter((item) => {
        const fieldName = item.fieldName!;
        const valueArray = jsonform[fieldName] as checkArray | undefined;
        return fieldName !== undefined && (valueArray === undefined || valueArray.length === 0);
      })
      .map((item) => item.fieldName);
    return emptyNames;
  };

  // 表单提交
  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    //checkbox和 radio数据校验
    const emptyFieldNames = validateCheckbox()
    // 如果有未满足条件的字段，弹出它们的名称
    if (emptyFieldNames.length > 0) {
      const alertMessage = `${emptyFieldNames.join(', ')} is required`;
      alert(alertMessage); // 将所有 fieldName 拼接为一个字符串，并弹出
    } else {
      const formResult = await db.insert(userResponse).values({
        jsonResponse: JSON.stringify(jsonform),
        createBy: 'admin',
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        formRef: formId
      })

      if (formResult) {
        toast({
          title: 'Submit success',
        })
        window.location.reload()
        console.log('formResult')
      } else {
        toast({
          title: 'Submit failed'
        })
      }
      console.log('onSubmit')
    }
  }
  return (
    <form onSubmit={onFormSubmit} className='border p-5 md:w-[600px] rounded-lg' style={{ [`${styleItem?.key}`]: styleItem?.value }} data-theme={selectedTheme}  >
      <h2 className='font-bold text-center text-2xl'>{formData?.formTitle}</h2>
      <h2 className='text-sm text-gray-400 '>{formData?.formHeading}</h2>

      {formData?.formFields?.map((item, index) => {
        return (
          <div key={index} className='w-full my-5 flex items-center'>
            {item?.fieldType === 'select' ?
              <div className='w-full my-3'>
                <label className='font-bold text-xs text-gray-400'>{item?.label}</label>
                <Select required={item?.required} onValueChange={(v) => selectChange(v, item.fieldName!)}>
                  <SelectTrigger className="w-full bg-transparent">
                    <SelectValue placeholder={item?.placeholder} />
                  </SelectTrigger>
                  <SelectContent >
                    {item?.options?.map((option, index) => {
                      return (
                        <SelectItem value={option.value} key={index}>{option.text}</SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
              : item?.fieldType === 'radio' ?
                <div className='w-full my-3'>
                  <label className='font-bold text-xs text-gray-400'>{item?.label}</label>
                  <RadioGroup required={item.required} >
                    {item.options?.map((option, index) => {
                      return (
                        <div key={index} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.value} id={option.value} onClick={() => selectChange(option.value, item.fieldName!)} />
                          <Label htmlFor={option.value}>{option.text}</Label>
                        </div>
                      )
                    })}
                  </RadioGroup>
                </div>
                : item?.fieldType === 'checkbox' ?
                  <div className='w-full my-3 items-center'>
                    <label className='font-bold text-xs text-gray-400'>{item?.label}</label>
                    {item.options!.map((option, index) => {
                      return (
                        <div className='flex gap-2 items-center' key={index}>
                          <Checkbox onCheckedChange={(v) => checkboxChange(item.fieldName!, option.value, v)} />
                          <h2> {option.text}</h2>
                        </div>
                      )
                    })
                    }
                  </div>
                  : <div className='w-full my-3'>
                    <label className='font-bold text-xs text-gray-400'>{item?.label}</label>
                    <input className='w-full border rounded-lg p-2' name={item?.fieldName} type={item?.fieldType} placeholder={item?.placeholder} required={item?.required} onChange={(e) => { inputChange(e) }} />
                  </div>}
            <div>
              {enableEdit == true && <FieldEdit defaultValue={{ ...item }} onUpdate={(value) => onFieldUpdate(value, index)} deleteField={() => onFieldDelete(index)} />}
            </div>
          </div>
        )
      })}

      {enableEdit == false && <Button type='submit' >Submit</Button>}
    </form >
  )
}


export default FormUI